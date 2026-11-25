// A deliberately small reader for the LaTeX article markup in PAGE_SOURCES.
// Keep prose as text nodes and leave mathematical expressions to KaTeX.
export type Inline =
  | { kind: 'text' | 'math' | 'citation'; value: string }
  | { kind: 'emphasis' | 'strong' | 'code'; children: Inline[] }
  | { kind: 'link'; href: string; children: Inline[] }

export type Block =
  | { kind: 'paragraph'; children: Inline[] }
  | { kind: 'heading'; level: 2 | 3 | 4; id: string; children: Inline[] }
  | { kind: 'math'; value: string }
  | { kind: 'list'; ordered: boolean; items: Inline[][] }
  | { kind: 'bibliography'; entries: { key: string; children: Inline[] }[] }

export type Article = {
  title: string
  macros: Record<string, string>
  blocks: Block[]
}

const proseCommands = {
  textit: 'emphasis',
  emph: 'emphasis',
  textbf: 'strong',
  texttt: 'code',
} as const

function group(source: string, start: number) {
  let index = start
  while (/\s/.test(source[index] ?? '')) index += 1
  if (source[index] !== '{') throw new Error(`Expected a LaTeX argument near ${source.slice(start, start + 25)}`)

  const contentStart = ++index
  let depth = 1
  for (; index < source.length; index += 1) {
    if (source[index] === '\\') {
      index += 1
    } else if (source[index] === '{') {
      depth += 1
    } else if (source[index] === '}') {
      depth -= 1
      if (depth === 0) return { value: source.slice(contentStart, index), end: index + 1 }
    }
  }
  throw new Error('Unclosed LaTeX argument')
}

function through(source: string, start: number, closing: string) {
  const close = source.indexOf(closing, start)
  if (close < 0) throw new Error(`Missing LaTeX delimiter ${closing}`)
  return { value: source.slice(start, close), end: close + closing.length }
}

function displayText(text: string) {
  return text.replace(/\s+/g, ' ').replace(/``/g, '“').replace(/''/g, '”')
    .replace(/---/g, '—').replace(/--/g, '–').replace(/~/g, '\u00a0')
}

export function parseInline(source: string): Inline[] {
  const nodes: Inline[] = []
  let pending = ''
  const flush = () => {
    if (pending) nodes.push({ kind: 'text', value: displayText(pending) })
    pending = ''
  }

  for (let index = 0; index < source.length;) {
    const current = source[index]
    if (current === '$' || source.startsWith('\\(', index)) {
      flush()
      const math = current === '$' ? through(source, index + 1, '$') : through(source, index + 2, '\\)')
      nodes.push({ kind: 'math', value: math.value })
      index = math.end
      continue
    }

    if (source.startsWith('{\\i}', index)) {
      pending += 'ı'
      index += 4
      continue
    }

    if (current !== '\\') {
      pending += current
      index += 1
      continue
    }

    const next = source[index + 1] ?? ''
    if ('%&#_{}$ '.includes(next) && next) {
      pending += next
      index += 2
      continue
    }

    const command = /^\\([a-zA-Z]+)/.exec(source.slice(index))
    if (!command) throw new Error(`Unsupported LaTeX prose near ${source.slice(index, index + 25)}`)
    flush()
    const name = command[1]
    const argument = group(source, index + command[0].length)
    index = argument.end
    if (name in proseCommands) {
      nodes.push({ kind: proseCommands[name as keyof typeof proseCommands], children: parseInline(argument.value) })
    } else if (name === 'href') {
      const label = group(source, index)
      const href = argument.value.replace(/\\([~%#_&])/g, '$1')
      if (!/^https?:\/\//i.test(href)) throw new Error(`Unsupported LaTeX link: ${href}`)
      nodes.push({ kind: 'link', href, children: parseInline(label.value) })
      index = label.end
    } else if (name === 'cite') {
      nodes.push({ kind: 'citation', value: argument.value })
    } else {
      throw new Error(`Unsupported LaTeX prose command: ${name}`)
    }
  }

  flush()
  return nodes
}

export function inlineLabel(nodes: Inline[]): string {
  return nodes.map((node) => 'children' in node ? inlineLabel(node.children) : node.value).join('')
}

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const headings = new Map<string, number>()
  const markup = /\$|\\\(|\\\[|\\(?:section|subsection|subsubsection)\*?\s*(?=\{)|\\begin\{(?:itemize|enumerate|thebibliography|align\*?|equation\*?)\}|\\par\b|\n[\t ]*\n+/g
  let start = 0

  const paragraph = (end: number) => {
    const body = source.slice(start, end).trim()
    if (body) blocks.push({ kind: 'paragraph', children: parseInline(body) })
  }

  for (let match = markup.exec(source); match; match = markup.exec(source)) {
    const token = match[0]
    const after = markup.lastIndex
    if (token === '$' && source[match.index - 1] === '\\') continue
    if (token === '$' || token === '\\(') {
      markup.lastIndex = through(source, after, token === '$' ? '$' : '\\)').end
      continue
    }

    paragraph(match.index)
    if (token === '\\[') {
      const math = through(source, after, '\\]')
      blocks.push({ kind: 'math', value: math.value.trim() })
      markup.lastIndex = math.end
    } else if (/^\\(?:sub)*section/.test(token)) {
      const heading = group(source, after)
      const children = parseInline(heading.value)
      const slug = inlineLabel(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const count = (headings.get(slug) ?? 0) + 1
      headings.set(slug, count)
      const level = token.startsWith('\\subsub') ? 4 : token.startsWith('\\sub') ? 3 : 2
      blocks.push({ kind: 'heading', level, id: count === 1 ? slug : `${slug}-${count}`, children })
      markup.lastIndex = heading.end
    } else if (token.startsWith('\\begin')) {
      const environment = token.slice(7, -1)
      const contentStart = environment === 'thebibliography' ? group(source, after).end : after
      const environmentBody = through(source, contentStart, `\\end{${environment}}`)
      const body = environmentBody.value
      if (environment === 'thebibliography') {
        const entries = [...body.matchAll(/\\bibitem\{([^}]+)\}/g)].map((item, index, all) => ({
          key: item[1],
          children: parseInline(body.slice(item.index + item[0].length, all[index + 1]?.index).trim()),
        }))
        blocks.push({ kind: 'bibliography', entries })
      } else if (environment === 'itemize' || environment === 'enumerate') {
        const items = body.split(/\\item\b/).slice(1).map((item) => parseInline(item.trim()))
        blocks.push({ kind: 'list', ordered: environment === 'enumerate', items })
      } else {
        // KaTeX uses aligned inside a math display rather than LaTeX's outer align.
        const value = environment.startsWith('align') ? `\\begin{aligned}${body}\\end{aligned}` : body.trim()
        blocks.push({ kind: 'math', value })
      }
      markup.lastIndex = environmentBody.end
    }
    start = markup.lastIndex
  }
  paragraph(source.length)
  return blocks
}

export function parseLatexPage(raw: string): Article {
  const source = raw.replace(/\r\n/g, '\n').replace(/(?<!\\)%[^\n]*/g, '')
  const beginning = source.indexOf('\\begin{document}')
  if (beginning < 0) throw new Error('Missing LaTeX document body')

  const macros: Record<string, string> = {}
  for (const macro of source.slice(0, beginning).matchAll(/\\newcommand\{(\\[a-zA-Z]+)\}/g)) {
    macros[macro[1]] = group(source, macro.index + macro[0].length).value
  }

  const document = through(source, beginning + '\\begin{document}'.length, '\\end{document}').value
  const title = /\{\\LARGE\s*\\bfseries\s+([^\n]+?)\\par\}/.exec(document)
  if (!title) throw new Error('Missing LaTeX page heading')
  const body = document.slice(title.index + title[0].length).replace(/^\s*\\medskip\b/, '')
  return { title: inlineLabel(parseInline(title[1].trim())), macros, blocks: parseBlocks(body) }
}

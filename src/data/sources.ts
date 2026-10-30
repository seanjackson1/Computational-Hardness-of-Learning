export type Source = {
  id: string
  category: 'Learning theory' | 'Cryptography' | 'Learning hardness' | 'Implementation'
  title: string
  authors: string
  year: string
  link: string
  note: string
  usedInSections: number[] | 'Developer docs'
}

export const sources: Source[] = [
  { id: 'KV94', category: 'Learning theory', title: 'An Introduction to Computational Learning Theory', authors: 'Michael J. Kearns & Umesh V. Vazirani', year: '1994', link: 'https://mitpress.mit.edu/9780262111935/an-introduction-to-computational-learning-theory/', note: 'Chapters 1, 2, and 6', usedInSections: [1, 2, 3, 5, 7] },
  { id: 'SSBD14', category: 'Learning theory', title: 'Understanding Machine Learning: From Theory to Algorithms', authors: 'Shai Shalev-Shwartz & Shai Ben-David', year: '2014', link: 'https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/', note: 'PAC and finite-class learning material', usedInSections: [2, 3] },
  { id: 'MIT26', category: 'Cryptography', title: 'Cryptography and Machine Learning: Foundations and Frontiers', authors: 'MIT 6.S976 / 18.S996', year: '2026', link: 'https://mlcrypto.mit.edu/course/', note: 'Lectures 2, 4, and 5', usedInSections: [1, 2, 4, 5, 6, 7] },
  { id: 'GGM86', category: 'Cryptography', title: 'How to Construct Random Functions', authors: 'Oded Goldreich, Shafi Goldwasser & Silvio Micali', year: '1986', link: 'https://doi.org/10.1145/6490.6503', note: 'JACM 33(4)', usedInSections: [4, 5] },
  { id: 'STANFORD-PRF', category: 'Cryptography', title: 'Pseudo-Random Functions', authors: 'Stanford Cryptography Notes', year: 'n.d.', link: 'https://crypto.stanford.edu/pbc/notes/crypto/prf.html', note: 'Introductory PRF notes', usedInSections: [4, 5] },
  { id: 'KV94-RELATED', category: 'Learning hardness', title: 'Cryptographic Limitations on Learning Boolean Formulae and Finite Automata', authors: 'Michael Kearns & Leslie Valiant', year: '1994', link: 'https://www.cis.upenn.edu/~mkearns/papers/crypto.pdf', note: 'Related work; distinct from the Kearns–Vazirani textbook', usedInSections: [7] },
  { id: 'MDN-WEBCRYPTO', category: 'Implementation', title: 'Web Crypto API', authors: 'MDN Web Docs', year: 'n.d.', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API', note: 'Browser cryptography reference', usedInSections: [6] },
]

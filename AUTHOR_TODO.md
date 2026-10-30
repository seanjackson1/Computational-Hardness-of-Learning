# Author checklist

The interface, formulas, demonstrations, and source links are scaffolding. All teaching prose must be written and verified by the student. Replace the matching placeholders in `src/App.tsx`; if the amount of prose grows, move the text into the empty fields in `src/content/sections.ts` and render those fields from the section components.

## 1. Introduction and Motivation

- Introduce black-box function learning in original language.
- Explain why sample sufficiency and algorithmic efficiency are different questions.
- Connect learning and cryptography without suggesting unconditional hardness.
- Consult: KV94 Chapters 1 and 6; MIT26 Lectures 2 and 5.

## 2. Foundations of PAC Learning

- Define the realizable PAC setting and all notation.
- State what randomness the outer probability covers.
- Distinguish realizable and agnostic learning.
- Add one original example.
- Consult: KV94 Chapter 1; SSBD14 introductory PAC chapters.

## 3. Sample Complexity vs. Computational Complexity

- Verify the finite-class theorem assumptions and ceiling convention.
- Write the four proof-step explanations.
- Interpret the calculator without calling the bound necessary.
- Consult: KV94 Chapter 2; SSBD14 finite-class ERM material.

## 4. Pseudorandom Functions

- Define efficient keyed evaluation and computational indistinguishability.
- Define every probability space in the advantage expression.
- Explain repeated-query consistency.
- Consult: GGM86; STANFORD-PRF; MIT26 Lectures 4–5.

## 5. Main Theorem

- Supply a fully quantified conditional theorem statement.
- Write each reduction step in original language.
- Verify the illustrative `epsilon = delta = 1/4` calculation.
- Cover the collision/fresh-input adjustment and efficient hypothesis evaluation.
- Clearly separate this conditional theorem from claims about a real PRF or HMAC.
- Consult: MIT26 Lecture 5; KV94 Chapter 6; GGM86.

## 6. Interactive Demonstrations

- Interpret the calculator controls.
- Explain GF(2) rank and unique recovery.
- State why the local oracle game is an illustration, not a security experiment.
- Consult: MIT26 Lectures 4–5; MDN Web Crypto API.

## 7. Implications and Further Reading

- Add implications, caveats, and a connection to current research.
- Distinguish elementary PRF-family hardness from restricted-concept-class results.
- Consult: KV94 Chapter 6; Kearns–Valiant; MIT26 Lecture 5.

## Final review

- Verify every formula and quantified statement with course material.
- Confirm every explanatory paragraph is student-authored.
- Test keyboard navigation, narrow screens, and all demonstrations.
- Confirm public-repository contents contain no private course files or copyrighted scans.

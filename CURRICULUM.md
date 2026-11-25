# Curriculum: Computational Hardness of Learning

## Prerequisites

- Basic probability
- Independent random variables and samples
- Conditional probability
- Union bounds
- Logarithms and exponentials
- Polynomial-time algorithms
- Asymptotic notation
- Reductions and proof by contradiction
- Negligible functions
- Binary arithmetic and linear algebra over \(\mathrm{GF}(2)\)

## Page 1: Introduction and Motivation

- Supervised binary classification
- Learning an unknown function from examples
- Target functions and hypotheses
- Training data versus fresh inputs
- Information-theoretic learnability
- Computationally efficient learnability
- Connections between learning and cryptography

## Page 2: Foundations of PAC Learning

- Instance spaces
- Concept and hypothesis classes
- Input distributions
- Generalization error
- The parameters \(\epsilon\) and \(\delta\)
- Realizable PAC learning
- Agnostic learning
- Proper versus improper learning
- Sample complexity
- Computational efficiency
- Sources of randomness in PAC guarantees

## Page 3: Sample Complexity vs. Computational Complexity

- Consistent hypotheses
- Empirical risk minimization
- Bad hypotheses
- Finite hypothesis classes
- Probability that a bad hypothesis remains consistent
- The inequality \(1-\epsilon\le e^{-\epsilon}\)
- Union-bound arguments
- The finite-class PAC sample bound
- Sufficient versus necessary bounds
- Sample complexity versus search complexity

## Page 4: Pseudorandom Functions

- Keyed function families
- Efficient function evaluation
- Truly random functions
- Lazy sampling
- Oracle access
- Adaptive oracle queries
- Repeated-query consistency
- Probabilistic distinguishers
- Computational indistinguishability
- Distinguishing advantage
- Negligible advantage
- Computational versus statistical indistinguishability
- PRF security experiments

## Page 5: Hardness of Learning PRFs

- Cryptographic reductions
- Constructing a distinguisher from a learner
- Generating training examples through oracle queries
- Learning under the uniform distribution
- Efficiently evaluable output hypotheses
- Fresh test inputs
- Training/test collisions
- PRF-case success analysis
- Random-function independence
- The \(9/16\) versus \(1/2\) calculation
- Non-negligible distinguishing advantage
- Conditional hardness theorems
- Contradiction with PRF security

## Page 6: Interactive Demonstrations

- Computing the finite-class sample bound
- Parity functions
- Dot products modulo 2
- Linear systems over \(\mathrm{GF}(2)\)
- Gaussian elimination over \(\mathrm{GF}(2)\)
- Matrix rank
- Unique versus underdetermined solutions
- Dependent and repeated samples
- HMAC basics
- Browser Web Crypto
- PRF simulations versus genuine security experiments

## Page 7: Implications and Further Reading

- Information-theoretic versus computational complexity
- Conditional versus unconditional hardness
- Efficient evaluation versus efficient learning
- Limits of the PRF hardness result
- Cryptographic assumptions in learning theory
- Hardness for restricted concept classes
- Kearns–Valiant learning-hardness results
- Connections to contemporary machine learning
- Proper academic citations and limitations of claims

# What This Curriculum Is Being Used For

This curriculum supports a seven-page CS455 educational website titled *The Computational Hardness of Learning: From PAC Learning to Pseudorandom Functions*.

The website is intended to explain the distinction between having enough examples to learn a function and being able to perform that learning efficiently. Its main result is the conditional statement that a secure pseudorandom-function family cannot be efficiently PAC learned under the stated model, because such a learner could be converted into a PRF distinguisher.

Each group of topics above corresponds to one page of the website:

1. Introduce the learning problem and the project’s motivation.
2. Establish the PAC-learning definitions and notation.
3. Present the finite-class sample bound and distinguish sample complexity from running time.
4. Define pseudorandom functions and their security experiment.
5. Present the learner-to-distinguisher reduction forming the main theorem.
6. Support and interpret the website’s educational demonstrations.
7. State the result’s implications, limitations, and connections to related work.

The curriculum is a study checklist rather than finished website prose. It identifies what the student should learn before writing each page in their own words and verifying its mathematical and cryptographic claims.

import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const db = new Database(path.join(__dirname, "..", "dev.db"));

function uuid() {
  return randomUUID();
}

function insertCourse(id: string, title: string, slug: string, description: string, difficulty: string, category: string, duration: string) {
  db.prepare(`INSERT INTO courses (id, title, slug, description, difficulty, category, duration, thumbnail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, '/images/default-course.png', datetime('now'))`).run(id, title, slug, description, difficulty, category, duration);
}

function insertModule(id: string, courseId: string, title: string, order: number) {
  db.prepare(`INSERT INTO modules (id, course_id, title, "order") VALUES (?, ?, ?, ?)`).run(id, courseId, title, order);
}

function insertLesson(moduleId: string, title: string, slug: string, order: number, durationMinutes: number, content: string) {
  db.prepare(`INSERT INTO lessons (id, module_id, title, slug, "order", duration_minutes, content) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(uuid(), moduleId, title, slug, order, durationMinutes, content);
}

// Clean existing data
db.exec("DELETE FROM progress");
db.exec("DELETE FROM enrollments");
db.exec("DELETE FROM lessons");
db.exec("DELETE FROM modules");
db.exec("DELETE FROM courses");
db.exec("DELETE FROM users");

// ─── Course 1: Introduction to Artificial Intelligence ───

const c1Id = uuid();
insertCourse(c1Id, "Introduction to Artificial Intelligence", "intro-to-ai",
  "Understand what AI is, how it works, and why it matters. This course covers the fundamental concepts of artificial intelligence using plain language and real-world examples — no coding required.",
  "beginner", "AI Fundamentals", "2 hours");

const c1m1Id = uuid();
insertModule(c1m1Id, c1Id, "What is Artificial Intelligence?", 1);

insertLesson(c1m1Id, "The Big Picture: What AI Actually Is", "what-ai-actually-is", 1, 8, `# The Big Picture: What AI Actually Is

You've probably heard the term "Artificial Intelligence" hundreds of times — in the news, in movies, in product marketing. But what does it actually mean?

## A Simple Definition

**Artificial Intelligence (AI)** is the field of computer science focused on creating systems that can perform tasks that typically require human intelligence.

These tasks include things like:
- Understanding language (like reading an email)
- Recognizing images (like identifying a cat in a photo)
- Making decisions (like recommending a movie you might enjoy)
- Learning from experience (like getting better at a game over time)

## The Key Insight

Here's the most important thing to understand: **AI doesn't "think" like humans do.** Instead, it uses mathematics and data to find patterns and make predictions.

Think of it this way:

> If you show a child thousands of pictures of cats and dogs, they learn to tell them apart. AI works similarly — it learns from examples — but it does so using math instead of biological neurons.

## AI vs. Traditional Software

Traditional software follows explicit rules written by programmers:

\`\`\`
IF temperature > 90 THEN turn_on_ac()
\`\`\`

AI is different. Instead of following hand-written rules, it **learns rules from data**:

| Traditional Software | AI Software |
|---|---|
| Rules are written by humans | Rules are learned from data |
| Predictable outputs | Probabilistic outputs |
| Struggles with ambiguity | Handles ambiguity well |
| Easy to explain | Harder to explain |

## Why AI Matters Now

AI has been around since the 1950s, so why is it suddenly everywhere? Three things changed:

1. **More data** — The internet generates massive amounts of data to learn from
2. **More computing power** — Modern GPUs can process data millions of times faster
3. **Better algorithms** — Researchers discovered more effective ways for machines to learn

## Key Takeaway

AI is not magic and it's not science fiction. It's a set of mathematical techniques that allow computers to learn patterns from data and make predictions. Understanding this foundation will make everything else in this course click into place.`);

insertLesson(c1m1Id, "A Brief History of AI", "brief-history-of-ai", 2, 10, `# A Brief History of AI

Understanding where AI came from helps you understand where it's going. Let's walk through the major milestones.

## The Birth of AI (1950s)

The story begins with **Alan Turing**, a British mathematician. In 1950, he asked a revolutionary question:

> "Can machines think?"

He proposed the **Turing Test**: if a machine can have a conversation with a human and the human can't tell it's a machine, then the machine can be considered "intelligent."

In 1956, a group of researchers at **Dartmouth College** officially coined the term "Artificial Intelligence" and set out to build thinking machines.

## The First AI Winter (1970s)

Early AI systems could solve toy problems but failed at real-world complexity. Funding dried up. This period is called the **"AI Winter"** — a time when interest and investment in AI dropped dramatically.

## Expert Systems Era (1980s)

AI bounced back with **expert systems** — programs that captured the knowledge of human specialists in specific domains. For example:
- **MYCIN** could diagnose blood infections
- **DENDRAL** could identify chemical structures

## The Machine Learning Revolution (2000s–2010s)

Instead of programming rules by hand, researchers began **letting computers learn from data**. Key milestones:
- **2006:** Geoffrey Hinton demonstrates effective "deep learning"
- **2011:** IBM Watson wins Jeopardy!
- **2012:** Deep learning crushes previous records in image recognition

## The Modern Era (2017–Present)

The introduction of the **Transformer architecture** in 2017 revolutionized AI:
- **2020:** GPT-3 demonstrates impressive text generation
- **2022:** ChatGPT brings AI to the mainstream
- **2023–2024:** Multimodal models can understand text, images, and code

## Key Takeaway

AI has gone through cycles of hype and disappointment. The current wave is different because it's built on massive data, powerful computers, and algorithms that actually work at scale.`);

insertLesson(c1m1Id, "Types of AI: Narrow, General, and Super", "types-of-ai", 3, 7, `# Types of AI: Narrow, General, and Super

Not all AI is created equal. Scientists categorize AI into three levels based on capability.

## Narrow AI (ANI) — What We Have Today

**Narrow AI** is designed to do **one specific task** really well. This is the only type of AI that exists today.

Examples:
- **Siri/Alexa** — understands voice commands
- **Google Translate** — translates between languages
- **Netflix recommendations** — suggests shows you might like
- **ChatGPT** — generates text responses

> Even though ChatGPT seems very capable, it's still narrow AI. It's excellent at language tasks but can't transfer its skills to physical tasks.

## General AI (AGI) — The Goal

**General AI** would be a system that can understand, learn, and apply intelligence to **any task** a human can do. AGI would be able to learn new skills without being specifically trained and transfer knowledge between domains.

**Does AGI exist?** No. Despite the hype, no one has built AGI yet.

## Super AI (ASI) — The Hypothetical

**Super AI** would surpass human intelligence in every way. This is currently in the realm of science fiction.

| AI Type | Human Equivalent |
|---|---|
| Narrow AI | A specialist (e.g., a chess grandmaster) |
| General AI | A well-rounded adult human |
| Super AI | Beyond human capability |

## Key Takeaway

Everything you interact with today is **Narrow AI** — systems trained for specific tasks. AGI and ASI are future possibilities, not current realities.`);

const c1m2Id = uuid();
insertModule(c1m2Id, c1Id, "How AI Works", 2);

insertLesson(c1m2Id, "Data: The Fuel of AI", "data-fuel-of-ai", 1, 8, `# Data: The Fuel of AI

If AI is a car, data is the fuel. Without data, AI systems can't learn anything.

## Why Data Matters

AI learns by finding **patterns in data**. The more high-quality data it has, the better it learns.

## Types of Data

| Data Type | Examples |
|---|---|
| **Text** | Books, websites, emails |
| **Images** | Photos, medical scans |
| **Audio** | Speech recordings, music |
| **Numbers** | Sales figures, temperatures |
| **Video** | Security footage, movies |

## Training Data vs. Test Data

Data is split into two groups:
1. **Training data** (80%) — The AI learns from this
2. **Test data** (20%) — Used to check if the AI learned well

This is like studying for an exam: you study from your textbook (training data), then take a test with new questions (test data).

## Data Quality Matters

The saying **"garbage in, garbage out"** is especially true for AI:
- **Biased data** leads to biased AI
- **Incomplete data** leads to blind spots
- **Noisy data** leads to confused models
- **Insufficient data** leads to poor performance

## Key Takeaway

Data is the foundation of all AI. The quality, quantity, and diversity of data directly determine how well an AI system performs.`);

insertLesson(c1m2Id, "Models and Predictions", "models-and-predictions", 2, 9, `# Models and Predictions

You'll hear the word "model" constantly in AI. Let's demystify it.

## What Is a Model?

An AI **model** is a mathematical function that takes input data and produces an output prediction.

Think of it like a recipe:
- **Input:** ingredients (data)
- **Model:** the recipe (learned patterns)
- **Output:** the finished dish (prediction)

## How Models Learn

1. **Initialize** — Start with random guesses
2. **Predict and Compare** — Make a prediction, compare to the correct answer
3. **Adjust** — Reduce the error. Repeat thousands of times.

> Imagine learning to throw darts. Your first throw might miss entirely. But each throw, you adjust. After thousands, you hit the bullseye consistently.

## Types of Model Outputs

- **Classification:** "This email is spam" or "not spam"
- **Regression:** "This house is worth $425,000"
- **Generation:** "Here is a paragraph about climate change..."
- **Ranking:** "These are the top 5 products you'd like"

## Key Takeaway

A model is a mathematical function learned from data. It takes inputs and produces predictions through repeated training on examples.`);

insertLesson(c1m2Id, "Training, Validation, and Testing", "training-validation-testing", 3, 7, `# Training, Validation, and Testing

How do we know if an AI model is actually good?

## The Three Phases

### 1. Training Phase
The model sees training data and adjusts its parameters to minimize errors.

### 2. Validation Phase
We periodically check the model on unseen data to prevent **overfitting**.

### 3. Testing Phase
A final evaluation on completely fresh data.

## What is Overfitting?

**Overfitting** is when a model memorizes training data instead of learning general patterns.

| Scenario | Training Accuracy | Test Accuracy | Verdict |
|---|---|---|---|
| Underfitting | Low | Low | Model too simple |
| Good Fit | High | High (similar) | Just right |
| Overfitting | Very High | Low | Model memorized |

> It's like a student who memorizes every answer in the textbook but can't solve a new problem.

## Key Takeaway

Training is how a model learns. Validation tunes the process. Testing proves it works on new data. The biggest pitfall is overfitting.`);

// ─── Course 2: Machine Learning Fundamentals ───

const c2Id = uuid();
insertCourse(c2Id, "Machine Learning Fundamentals", "machine-learning-fundamentals",
  "Learn the three main types of machine learning — supervised, unsupervised, and reinforcement learning — with intuitive explanations and real-world examples.",
  "beginner", "Machine Learning", "3 hours");

const c2m1Id = uuid();
insertModule(c2m1Id, c2Id, "Supervised Learning", 1);

insertLesson(c2m1Id, "What is Supervised Learning?", "what-is-supervised-learning", 1, 8, `# What is Supervised Learning?

Supervised learning is the most common type of machine learning.

## The Core Idea

You teach the model by showing it **examples with answers**. The model's job: learn the pattern that connects questions to answers.

## What Does "Labeled" Mean?

**Labels** are the correct answers attached to each piece of data:

| Data (Input) | Label (Correct Answer) |
|---|---|
| Photo of a cat | "cat" |
| Photo of a dog | "dog" |
| Email text | "spam" or "not spam" |
| House features | Price: $350,000 |

## Two Types

### Classification
Predicts a **category**: Is this email spam or not spam?

### Regression
Predicts a **number**: What will this house sell for?

## Real-World Examples

- **Email spam filters** — trained on millions of labeled emails
- **Voice assistants** — trained on speech recordings with text transcriptions
- **Medical diagnosis** — trained on medical images labeled by doctors

## Key Takeaway

Supervised learning is learning from examples with known answers. The main challenge is acquiring enough labeled data.`);

insertLesson(c2m1Id, "Classification: Sorting Into Categories", "classification-sorting-categories", 2, 10, `# Classification: Sorting Into Categories

Classification predicts which **category** something belongs to.

## Types of Classification

- Email → Spam / Not Spam (**binary classification**)
- Image → Cat / Dog / Bird (**multi-class classification**)
- Review → Positive / Neutral / Negative (**sentiment classification**)

## How It Works: Spam Detection Example

### Step 1: Gather labeled training data
### Step 2: Extract features (word counts, sender info, etc.)
### Step 3: Train the model to find patterns
### Step 4: Predict on new data

## Common Algorithms

- **Logistic Regression** — Simple, fast, good baseline
- **Decision Trees** — Easy to understand, like a flowchart
- **Random Forests** — Many decision trees working together
- **Neural Networks** — Powerful but complex

## Measuring Performance

- **Accuracy** — What % of predictions were correct?
- **Precision** — Of items labeled positive, what % were actually positive?
- **Recall** — Of all actual positives, what % did we catch?

## Key Takeaway

Classification sorts items into predefined categories by learning patterns from labeled examples.`);

insertLesson(c2m1Id, "Regression: Predicting Numbers", "regression-predicting-numbers", 3, 9, `# Regression: Predicting Numbers

While classification sorts into categories, regression predicts a continuous number.

## Examples

- What will this house sell for? → **$425,000**
- How many customers will visit tomorrow? → **347**
- What will the temperature be at noon? → **73.2°F**

## Linear Regression

The simplest regression finds the **best straight line** through your data.

| Size (sq ft) | Price |
|---|---|
| 1,200 | $240,000 |
| 1,800 | $360,000 |
| 2,400 | $480,000 |

The model discovers: **Price = $200 × Size**

## Measuring Performance

- **Mean Absolute Error (MAE)** — Average distance between predictions and reality
- **R-squared (R²)** — How much variation the model explains (0.95 = explains 95%)

## Real-World Applications

- Stock price forecasting
- Demand planning for retail
- Medical dosing calculations
- Energy demand forecasting

## Key Takeaway

Regression predicts numbers by learning mathematical relationships from data.`);

const c2m2Id = uuid();
insertModule(c2m2Id, c2Id, "Unsupervised Learning", 2);

insertLesson(c2m2Id, "Learning Without Labels", "learning-without-labels", 1, 8, `# Learning Without Labels

Unsupervised learning finds hidden patterns in data **without any labels**.

## The Core Idea

You give the model data and ask it to find structure on its own.

- **Supervised** = Teacher gives questions AND answers
- **Unsupervised** = "Here's a pile of objects — organize them however makes sense"

## Main Types

### 1. Clustering
Grouping similar items together.

### 2. Dimensionality Reduction
Simplifying complex data while preserving patterns.

### 3. Anomaly Detection
Finding items that don't fit the normal pattern.

## A Clustering Example

Imagine 10,000 customers. Clustering might discover:
- **Bargain hunters** — buy frequently, spend little
- **Premium shoppers** — buy occasionally, spend a lot
- **Window shoppers** — browse a lot but rarely buy

Nobody told the algorithm these groups existed — it discovered them on its own.

## Key Takeaway

Unsupervised learning finds hidden patterns without needing labeled examples.`);

insertLesson(c2m2Id, "Clustering: Finding Natural Groups", "clustering-finding-groups", 2, 9, `# Clustering: Finding Natural Groups

Clustering divides data into groups where items in the same group are more similar to each other.

## K-Means Algorithm

1. **Choose K** — Decide how many clusters (e.g., K=3)
2. **Place centroids** — Randomly place K points in the data
3. **Assign points** — Each data point joins the nearest centroid
4. **Move centroids** — Move each centroid to the center of its cluster
5. **Repeat** until stable

> Imagine dropping 3 flags on a field of people. Everyone walks to their nearest flag. Then each flag moves to the center of its group. Repeat until stable.

## Real-World Applications

- **Customer segmentation** — Targeted marketing
- **Document organization** — Auto-categorize articles
- **Image compression** — Reduce colors by clustering similar ones
- **Social networks** — Identify communities

## Beyond K-Means

- **Hierarchical clustering** — Creates a tree of clusters
- **DBSCAN** — Finds clusters of any shape

## Key Takeaway

Clustering groups similar data points together without labels. K-Means is the go-to algorithm.`);

const c2m3Id = uuid();
insertModule(c2m3Id, c2Id, "Reinforcement Learning", 3);

insertLesson(c2m3Id, "Learning by Trial and Error", "learning-by-trial-and-error", 1, 9, `# Learning by Trial and Error

Reinforcement Learning (RL) is inspired by how animals learn through experience.

## The Core Idea

An **agent** learns by:
1. Taking **actions** in an **environment**
2. Receiving **rewards** or **penalties**
3. Adjusting behavior to maximize rewards

> Think of training a dog: sit on command = treat (reward). Chew shoes = scolded (penalty).

## Key Components

| Component | Description | Game Example |
|---|---|---|
| **Agent** | The learner | The player |
| **Environment** | The world | The game board |
| **State** | Current situation | Board position |
| **Action** | What the agent does | Move a piece |
| **Reward** | Feedback | +1 win, -1 lose |

## Exploration vs. Exploitation

- **Exploration:** Try new things to discover better strategies
- **Exploitation:** Stick with what already works

> Choosing a restaurant: go to your favorite (exploitation) or try somewhere new (exploration)?

## Famous Examples

- **AlphaGo** — Defeated the world champion at Go
- **OpenAI Five** — Defeated world champions at Dota 2
- **Robot locomotion** — Teaching robots to walk

## Key Takeaway

RL is about learning from interaction — taking actions, getting feedback, and improving over time.`);

// ─── Course 3: Understanding Large Language Models ───

const c3Id = uuid();
insertCourse(c3Id, "Understanding Large Language Models", "understanding-llms",
  "Demystify the technology behind ChatGPT, Claude, and other AI chatbots. Learn how LLMs work, what they can and can't do, and how to use them effectively.",
  "beginner", "AI Fundamentals", "2.5 hours");

const c3m1Id = uuid();
insertModule(c3m1Id, c3Id, "What Are Language Models?", 1);

insertLesson(c3m1Id, "From Text Prediction to Conversation", "text-prediction-to-conversation", 1, 10, `# From Text Prediction to Conversation

Large Language Models seem magical. But at their core, they're doing something surprisingly simple.

## The Basic Idea

A language model predicts the **next word** in a sequence.

Given: "The cat sat on the ___"
The model predicts: **"mat"**

That's it. Every LLM is a next-word prediction machine.

## How Does This Create Intelligence?

**Simple prediction:**
"The capital of France is ___" → **"Paris"**

To predict "Paris," the model must have learned geography!

**Complex prediction:**
"To solve x² + 5x + 6 = 0, we factor as (x+2)(x+3), so x = ___"

To predict correctly, it must have learned algebra!

## What Is a "Token"?

LLMs break text into **tokens** — smaller pieces:

| Text | Tokens |
|---|---|
| "Hello" | ["Hello"] |
| "understanding" | ["under", "standing"] |
| "ChatGPT" | ["Chat", "G", "PT"] |

## The Scale of Modern LLMs

| Model | Parameters | Training Data |
|---|---|---|
| GPT-2 (2019) | 1.5 billion | 40 GB of text |
| GPT-3 (2020) | 175 billion | ~570 GB |
| GPT-4 (2023) | ~1.8 trillion | ~13 trillion tokens |

## From Prediction to Conversation

1. **Pre-training** — Learn language from the internet
2. **Instruction tuning** — Train on instruction-following examples
3. **RLHF** — Humans rate responses, model learns preferences

## Key Takeaway

LLMs are next-word prediction systems trained on vast text. Additional training transforms raw prediction into useful conversation.`);

insertLesson(c3m1Id, "The Transformer Architecture", "transformer-architecture", 2, 12, `# The Transformer Architecture

The Transformer is the architecture behind every modern LLM.

## Before Transformers

Earlier models processed text **one word at a time**, left to right. They quickly "forgot" earlier words.

## The Key Innovation: Attention

The Transformer looks at **all words simultaneously** and figures out which words are most relevant to each other.

### Example

"The animal didn't cross the street because **it** was too tired."

What does "it" refer to? The **animal**. A Transformer learns this through attention.

"The animal didn't cross the street because **it** was too wide."

Here "it" refers to the **street**! Context determines the relationship.

## How Attention Works (Simplified)

For each word, the model asks:
1. **Query:** "What am I looking for?"
2. **Key:** "What do I contain?"
3. **Value:** "What information do I provide?"

Each word searches for the most relevant other words and combines their information.

## Multi-Head Attention

The Transformer computes attention **multiple times in parallel**:
- One head might learn grammar (subject-verb)
- Another might learn semantics (synonyms)
- Another might learn position (adjective before noun)

## Why Transformers Changed Everything

| Before | After |
|---|---|
| Sequential processing | Parallel processing |
| Limited context | Long context windows |
| Slow training | Fast GPU training |
| Modest capabilities | Emergent abilities at scale |

## Key Takeaway

Transformers process all words simultaneously using attention. This parallel processing, combined with massive scale, is what makes modern LLMs so capable.`);

insertLesson(c3m1Id, "What LLMs Can and Cannot Do", "llm-capabilities-limitations", 3, 10, `# What LLMs Can and Cannot Do

Understanding the real capabilities and limitations helps you use LLMs effectively.

## What LLMs Do Well

- **Writing** — Drafting emails, essays, documentation
- **Summarization** — Condensing long documents
- **Translation** — Converting between languages
- **Code generation** — Writing and explaining code
- **Explanation** — Breaking down complex topics

## What LLMs Do Poorly

### Hallucination
LLMs sometimes generate **confident but false information.** The model predicts what *sounds* plausible, not what *is* true.

### Math and Logic
LLMs struggle with complex arithmetic, multi-step reasoning, and precise counting.

### Real-Time Information
LLMs only know what was in their training data. No current news or live data.

## Common Misconceptions

| Misconception | Reality |
|---|---|
| "AI knows everything" | Only knows training data |
| "AI is always right" | Frequently hallucinates |
| "AI understands me" | Pattern matches, doesn't understand |
| "AI has opinions" | Generates plausible opinion-like text |

## How to Use LLMs Effectively

1. **Verify important facts** — Never trust blindly
2. **Be specific** — Clear prompts get better results
3. **Break down complex tasks** — Step-by-step works better
4. **Use as a starting point** — Great for drafts and brainstorming

## Key Takeaway

LLMs are powerful for language tasks but hallucinate, struggle with math, and don't truly understand. Treat them as knowledgeable but unreliable assistants.`);

const c3m2Id = uuid();
insertModule(c3m2Id, c3Id, "Using LLMs Effectively", 2);

insertLesson(c3m2Id, "Prompt Engineering Basics", "prompt-engineering-basics", 1, 11, `# Prompt Engineering Basics

How you ask determines what you get.

## The Anatomy of a Good Prompt

1. **Role/Context** — Who should the AI act as?
2. **Task** — What do you want it to do?
3. **Specifics** — Details, constraints, format
4. **Examples** — Show what you want

## Technique 1: Be Specific

**Vague:** "Tell me about dogs"

**Specific:** "Explain the top 5 beginner-friendly dog breeds for apartment living. Include temperament, size, and exercise needs. Format as a numbered list."

## Technique 2: Give a Role

"You are a patient science teacher explaining to a 12-year-old. Explain quantum computing using simple analogies."

## Technique 3: Use Examples (Few-Shot)

Show the model the pattern you want:
- Input → Output
- Input → Output
- New input → ?

## Technique 4: Chain of Thought

Ask the model to **think step by step** for complex reasoning. This dramatically improves accuracy.

## Technique 5: Specify Output Format

"Format your response as a JSON array" or "Use markdown headers and bullet points."

## Common Mistakes

- Being too vague
- Asking multiple unrelated questions at once
- Not providing context
- Expecting perfection on the first try

## Key Takeaway

Prompt engineering is about clear communication. Be specific, provide context, give examples, and ask for step-by-step reasoning.`);

insertLesson(c3m2Id, "The Ethics of AI", "ethics-of-ai", 2, 10, `# The Ethics of AI

As AI becomes more powerful, ethical considerations become increasingly important.

## Bias in AI

AI bias comes from **biased training data**:
- **Historical bias** — Past data reflects past discrimination
- **Representation bias** — Training data doesn't represent everyone equally
- **Measurement bias** — Using proxy metrics that encode unfairness

### Famous Examples
- Amazon's hiring AI discriminated against women
- Healthcare algorithms underestimated Black patients' needs
- Facial recognition had much higher error rates for darker skin tones

## Transparency

Many AI models are "black boxes" that can't explain their decisions. This is problematic when AI decides loan approvals, criminal sentencing, or medical treatment.

## Privacy Concerns

- Was training data collected with consent?
- Can AI models reveal private information?
- AI can infer sensitive information from seemingly innocent data

## Responsible AI Principles

1. **Fairness** — Treat all people equitably
2. **Transparency** — Explain how decisions are made
3. **Privacy** — Protect personal data
4. **Safety** — Don't cause harm
5. **Accountability** — Someone is responsible for outcomes
6. **Human oversight** — Humans remain in control

## What You Can Do

- Ask questions when AI systems affect you
- Report bias when you notice it
- Stay informed about AI ethics
- Think critically about AI outputs

## Key Takeaway

AI ethics affects everyone. Bias, transparency, privacy, and accountability are critical issues as AI becomes more powerful.`);

db.close();
console.log("Seed data created successfully!");

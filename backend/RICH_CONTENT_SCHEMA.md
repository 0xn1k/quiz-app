# Rich Content Question Schema

## ✅ Updated Schema Features

- ✅ **LaTeX Math Support** - Store formulas as LaTeX
- ✅ **Images** - Store URLs from S3/Cloudinary
- ✅ **Tables** - Store as JSON arrays
- ✅ **Markdown** - Rich text formatting
- ✅ **Mixed Content** - Combine text, math, images in one question
- ✅ **Backward Compatible** - Old simple text questions still work

---

## 📝 Schema Structure

### Content Block Types

```javascript
{
  type: 'text' | 'math' | 'image' | 'table' | 'markdown',
  text: String,      // for text/markdown
  formula: String,   // for math (LaTeX)
  url: String,       // for images
  caption: String,   // for images
  data: Array        // for tables
}
```

### Option Types

```javascript
{
  type: 'text' | 'math' | 'image',
  text: String,      // for text options
  formula: String,   // for math options (LaTeX)
  url: String        // for image options
}
```

---

## 📚 Example Questions

### Example 1: Simple Text Question (Backward Compatible)

```json
{
  "question": "What is the capital of France?",
  "options": [
    { "type": "text", "text": "London" },
    { "type": "text", "text": "Berlin" },
    { "type": "text", "text": "Paris" },
    { "type": "text", "text": "Madrid" }
  ],
  "answerIndex": 2,
  "category": "Geography",
  "difficulty": "easy"
}
```

### Example 2: Math Question with LaTeX

```json
{
  "content": [
    { "type": "text", "text": "Find the mean using the formula:" },
    { "type": "math", "formula": "\\bar{x} = \\frac{\\Sigma x}{n}" },
    { "type": "text", "text": "Given: n = 10, Σx = 150" }
  ],
  "options": [
    { "type": "text", "text": "10" },
    { "type": "text", "text": "15" },
    { "type": "text", "text": "20" },
    { "type": "math", "formula": "\\sqrt{225}" }
  ],
  "answerIndex": 1,
  "explanation": [
    { "type": "text", "text": "Using the formula:" },
    { "type": "math", "formula": "\\bar{x} = \\frac{150}{10} = 15" }
  ],
  "category": "Mathematics",
  "subject": "Statistics",
  "difficulty": "medium",
  "isPYQ": true,
  "year": 2023,
  "exam": "SSC CGL"
}
```

### Example 3: Question with Image/Diagram

```json
{
  "content": [
    { "type": "text", "text": "Study the frequency distribution table below:" },
    {
      "type": "image",
      "url": "https://cdn.myapp.com/questions/freq-table-123.png",
      "caption": "Frequency Distribution Table"
    },
    { "type": "text", "text": "What is the median class?" }
  ],
  "options": [
    { "type": "text", "text": "10-20" },
    { "type": "text", "text": "20-30" },
    { "type": "text", "text": "30-40" },
    { "type": "text", "text": "40-50" }
  ],
  "answerIndex": 1,
  "category": "Mathematics",
  "subject": "Statistics",
  "difficulty": "medium"
}
```

### Example 4: Question with Table

```json
{
  "content": [
    { "type": "text", "text": "Calculate the mean from the following data:" },
    {
      "type": "table",
      "data": [
        ["Class", "Frequency"],
        ["0-10", "5"],
        ["10-20", "8"],
        ["20-30", "12"],
        ["30-40", "7"]
      ]
    }
  ],
  "options": [
    { "type": "text", "text": "18.5" },
    { "type": "text", "text": "19.2" },
    { "type": "text", "text": "20.1" },
    { "type": "text", "text": "21.3" }
  ],
  "answerIndex": 0,
  "category": "Mathematics",
  "difficulty": "hard"
}
```

### Example 5: Mixed Content Question

```json
{
  "content": [
    { "type": "text", "text": "The standard deviation formula is:" },
    { "type": "math", "formula": "\\sigma = \\sqrt{\\frac{\\Sigma(x - \\bar{x})^2}{n}}" },
    {
      "type": "image",
      "url": "https://cdn.myapp.com/diagrams/std-dev-example.png",
      "caption": "Example calculation"
    },
    { "type": "text", "text": "What is the standard deviation?" }
  ],
  "options": [
    { "type": "math", "formula": "\\sqrt{10}" },
    { "type": "math", "formula": "\\sqrt{15}" },
    { "type": "math", "formula": "\\sqrt{20}" },
    { "type": "text", "text": "5" }
  ],
  "answerIndex": 0,
  "explanation": [
    { "type": "text", "text": "Step-by-step calculation:" },
    { "type": "math", "formula": "\\sigma = \\sqrt{\\frac{100}{10}} = \\sqrt{10}" }
  ],
  "category": "Mathematics",
  "subject": "Statistics",
  "topic": "Standard Deviation",
  "difficulty": "hard",
  "isPYQ": true,
  "year": 2023,
  "exam": "SSC CGL",
  "tags": ["statistics", "standard-deviation", "variance"]
}
```

---

## 🔌 API Usage

### Create Rich Content Question

```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": [
      { "type": "text", "text": "Find the median:" },
      { "type": "math", "formula": "\\tilde{x} = l + \\frac{(n/2 - cf)}{f} \\cdot h" }
    ],
    "options": [
      { "type": "text", "text": "15" },
      { "type": "text", "text": "20" },
      { "type": "text", "text": "25" },
      { "type": "text", "text": "30" }
    ],
    "answerIndex": 1,
    "category": "Mathematics",
    "subject": "Statistics",
    "difficulty": "medium",
    "isPYQ": true,
    "year": 2023,
    "exam": "SSC CGL"
  }'
```

---

## 🖼️ Image Storage Strategy

### Recommended: Cloudinary (Free Tier)

1. **Sign up:** https://cloudinary.com/
2. **Upload images** via API or dashboard
3. **Get URL:** `https://res.cloudinary.com/your-cloud/image/upload/v1234/question-img.png`
4. **Store URL** in question schema

### Alternative: AWS S3

1. Create S3 bucket
2. Upload images
3. Make public or use signed URLs
4. Store URL in database

### Cost Comparison

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Cloudinary | 25GB storage, 25GB bandwidth | $0.10/GB |
| AWS S3 | 5GB for 12 months | $0.023/GB |
| Firebase Storage | 5GB storage, 1GB/day bandwidth | $0.026/GB |

---

## 📊 Frontend Rendering

### React/Next.js Example

```javascript
// Render question content
const renderContent = (content) => {
  return content.map((block, index) => {
    switch (block.type) {
      case 'text':
        return <p key={index}>{block.text}</p>;
      
      case 'math':
        return <MathJax key={index}>{`$$${block.formula}$$`}</MathJax>;
      
      case 'image':
        return (
          <img 
            key={index} 
            src={block.url} 
            alt={block.caption}
            className="question-image"
          />
        );
      
      case 'table':
        return (
          <table key={index}>
            {block.data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </table>
        );
      
      case 'markdown':
        return <ReactMarkdown key={index}>{block.text}</ReactMarkdown>;
      
      default:
        return null;
    }
  });
};
```

### Install Required Packages

```bash
npm install react-mathjax3 react-markdown
```

---

## 🎯 Migration Strategy

### For Existing Questions

Old questions with simple `question: String` will still work!

The schema is **backward compatible**:
- Old format: `question: "What is 2+2?"`
- New format: `content: [{ type: "text", text: "What is 2+2?" }]`

Both work seamlessly.

---

## 📝 Best Practices

1. **Images:** Always use CDN URLs, never base64
2. **LaTeX:** Test formulas before storing
3. **Tables:** Keep under 50 rows for performance
4. **File naming:** Use descriptive names: `ssc-2023-q15-diagram.png`
5. **Compression:** Compress images before upload
6. **Caching:** Use CDN for faster loading

---

## 🚀 Next Steps

1. ✅ Schema updated
2. ⬜ Upload images to Cloudinary/S3
3. ⬜ Create bulk import API for PDF questions
4. ⬜ Add LaTeX renderer in frontend
5. ⬜ Test with SSC PDF questions

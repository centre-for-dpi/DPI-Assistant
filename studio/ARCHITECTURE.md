# DPI Coach Architecture Guidelines

## 📁 **Directory Structure**

```
studio/
├── src/                           # Next.js Frontend
│   ├── ai/                       # Frontend AI integration
│   ├── app/                      # Next.js app router pages
│   ├── components/               # React components
│   ├── content/                  # 🎯 PRIMARY CONTENT SOURCE
│   │   ├── knowledge-base/       # ✅ Single source of truth for all knowledge
│   │   └── prompts/              # ✅ AI prompts (comprehensive versions)
│   ├── hooks/                    # React hooks
│   ├── lib/                      # Frontend utilities
│   ├── scripts/                  # Build/deployment scripts
│   └── types/                    # TypeScript type definitions
│
└── functions/                     # Firebase Functions Backend
    ├── src/
    │   ├── ai/                   # Backend AI processing
    │   ├── content/
    │   │   └── prompts/          # Backend prompts (kept in sync)
    │   ├── lib/                  # Backend utilities
    │   └── index.ts              # Firebase functions entry
    └── package.json              # Backend dependencies
```

## 🚨 **CRITICAL: Avoiding Duplications**

### **Knowledge Base Rules**
- **PRIMARY SOURCE**: `src/content/knowledge-base/` ONLY
- **SYNCED COPY**: `functions/src/content/knowledge-base/` (required for Firebase Functions)
- **NEVER CREATE**: Additional knowledge-base folders elsewhere
- **Reading Knowledge**: 
  - Frontend AI: reads from `src/content/knowledge-base/`
  - Backend Functions: reads from `functions/src/content/knowledge-base/`

### **Prompt Management**
- **PRIMARY SOURCE**: `src/content/prompts/` (comprehensive versions)
- **SYNC REQUIRED**: `functions/src/content/prompts/` must stay in sync
- **UPDATE PROCESS**: Always update main src first, then sync to functions

### **AI Code Separation**
- **Frontend AI**: `src/ai/` - Client-side AI integration
- **Backend AI**: `functions/src/ai/` - Server-side AI processing
- **Shared Types**: Use `src/types/ai.ts` for consistency
- **Import Style**: Use `import * as` for Node.js compatibility

## 🔄 **Sync Procedures**

### When Adding New Knowledge Base Content:
1. Add to `src/content/knowledge-base/` (PRIMARY)
2. **CRITICAL**: Copy to `functions/src/content/knowledge-base/` (SYNC)
3. Update any hardcoded file references in AI flows
4. Test both frontend and backend AI integrations

**Sync Command**: `cp -r src/content/knowledge-base/* functions/src/content/knowledge-base/`

### When Updating Prompts:
1. Update `src/content/prompts/` first
2. Copy to `functions/src/content/prompts/`
3. Verify consistency across both locations

### When Adding AI Features:
1. Define types in `src/types/ai.ts`
2. Implement frontend version in `src/ai/`
3. Implement backend version in `functions/src/ai/`
4. Ensure import consistency (`import * as`)

## ✅ **Quality Checks**

Before any deployment:
```bash
# Check for duplicate knowledge bases
find . -name "knowledge-base" -type d -not -path "./node_modules/*"
# Should only show: ./src/content/knowledge-base

# Verify prompt sync
diff src/content/prompts/ functions/src/content/prompts/
# Should show no differences

# Check for consistent imports
grep -r "import.*from.*fs" src/ai/ functions/src/ai/
# Should all use "import * as fs"
```

## 🎯 **Content Source Truth**

| Content Type | Primary Location | Secondary/Sync |
|--------------|------------------|----------------|
| Knowledge Base | `src/content/knowledge-base/` | `functions/src/content/knowledge-base/` |
| Prompts | `src/content/prompts/` | `functions/src/content/prompts/` |
| AI Types | `src/types/ai.ts` | ❌ None (single source) |
| Frontend AI | `src/ai/` | ❌ None |
| Backend AI | `functions/src/ai/` | ❌ None |

## 🚧 **Migration History**

- **2024-01**: Consolidated 3 knowledge-base locations into 1
- **2024-01**: Unified prompts to comprehensive versions
- **2024-01**: Standardized AI import syntax
- **2024-01**: Created shared type definitions
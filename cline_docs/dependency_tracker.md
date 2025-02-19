{
  "modules": {
    "M1": {
      "codeDependsOn": ["M2", "M3", "M4"],
      "docDependsOn": ["D1", "D2"],
      "dependedOnBy": []
    },
    "M2": {
      "codeDependsOn": ["M3"],
      "docDependsOn": ["D1"],
      "dependedOnBy": ["M1"]
    },
    "M3": {
      "codeDependsOn": [],
      "docDependsOn": [],
      "dependedOnBy": ["M1", "M2"]
    },
    "M4": {
      "codeDependsOn": [],
      "docDependsOn": [],
      "dependedOnBy": ["M1"]
    }
  },
  "tasks": {},
  "context": {},
  "index": {
    "M1": "src/pages",
    "M2": "src/components",
    "M3": "src/assets",
    "M4": "src/scripts",
    "D1": "cline_docs/productContext.md",
    "D2": "cline_docs/howitworks.md"
  }
}

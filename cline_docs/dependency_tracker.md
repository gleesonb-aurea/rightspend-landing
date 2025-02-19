{
  "modules": {
    "M1": {
      "codeDependsOn": ["M2", "M3", "M4", "M5", "M6"],
      "docDependsOn": ["D1", "D2", "D3"],
      "dependedOnBy": []
    },
    "M2": {
      "codeDependsOn": ["M3", "M4"],
      "docDependsOn": [],
      "dependedOnBy": ["M1"]
    },
    "M3": {
      "codeDependsOn": [],
      "docDependsOn": [],
      "dependedOnBy": ["M1", "M2", "M6"]
    },
    "M4": {
      "codeDependsOn": ["M3"],
      "docDependsOn": [],
      "dependedOnBy": ["M1", "M2", "M6"]
    },
    "M5": {
      "codeDependsOn": [],
      "docDependsOn": [],
      "dependedOnBy": ["M1", "M6"]
    },
    "M6": {
      "codeDependsOn": ["M3", "M4", "M5"],
      "docDependsOn": [],
      "dependedOnBy": ["M1"]
    }
  },
  "tasks": {
    "T1": {
      "description": "Development environment setup",
      "dependsOn": [],
      "status": "in-progress"
    },
    "T2": {
      "description": "Component implementation",
      "dependsOn": ["T1"],
      "status": "in-progress"
    },
    "T3": {
      "description": "Page development",
      "dependsOn": ["T1", "T2"],
      "status": "pending"
    }
  },
  "context": {
    "repository": "https://github.com/gleesonb-aurea/rightspend-landing",
    "branch": "feature/website-revamp",
    "deployment": {
      "hosting": "AWS S3",
      "cdn": "CloudFront",
      "automation": "GitHub Actions"
    },
    "development": {
      "node_version": "v22.14.0",
      "npm_version": "10.9.2",
      "environment": "local"
    }
  },
  "index": {
    "M1": "src/pages",
    "M2": "src/components/shared",
    "M3": "src/styles",
    "M4": "src/scripts",
    "M5": "src/assets",
    "M6": "src/components",
    "D1": "cline_docs/projectbrief.md",
    "D2": "cline_docs/productContext.md",
    "D3": "cline_docs/activeContext.md"
  }
}

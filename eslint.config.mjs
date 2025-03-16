import { defineConfig } from "eslint/config";
import sortClassMembers from "eslint-plugin-sort-class-members";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import jestFormatting from "eslint-plugin-jest-formatting";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("airbnb-base", "next/core-web-vitals", "plugin:prettier/recommended"),

    plugins: {
        "sort-class-members": sortClassMembers,
    },

    rules: {
        "prettier/prettier": ["error", {
            singleQuote: true,
            endOfLine: "auto",
        }],

        "sort-class-members/sort-class-members": [2, {
            order: [
                "[static-properties]",
                "[static-methods]",
                "[properties]",
                "[conventional-private-properties]",
                "constructor",
                "[methods]",
                "[conventional-private-methods]",
            ],

            accessorPairPositioning: "getThenSet",
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],

    extends: compat.extends(
        "airbnb",
        "airbnb-typescript",
        "next/core-web-vitals",
        "plugin:prettier/recommended",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "prettier/prettier": ["error", {
            singleQuote: true,
            endOfLine: "auto",
        }],

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: true,
        }],

        "import/extensions": "off",
        "react/function-component-definition": "off",
        "react/destructuring-assignment": "off",
        "react/require-default-props": "off",
        "react/jsx-props-no-spreading": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
        "import/prefer-default-export": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/order": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "jsx-a11y/label-has-associated-control": ["error", {
            required: {
                some: ["nesting", "id"],
            },
        }],

        "jsx-a11y/label-has-for": ["error", {
            required: {
                some: ["nesting", "id"],
            },
        }],

        "class-methods-use-this": ["error", {
            enforceForClassFields: false,
        }],
    },
}, {
    files: ["**/*.test.ts", "**/*.test.tsx"],

    extends: compat.extends(
        "plugin:jest-formatting/recommended",
        "plugin:testing-library/react",
        "plugin:jest-dom/recommended",
    ),

    plugins: {
        "jest-formatting": jestFormatting,
        "testing-library": testingLibrary,
        "jest-dom": jestDom,
    },
}, {
    files: ["**/*.spec.ts"],
    extends: compat.extends("plugin:playwright/recommended"),
}]);
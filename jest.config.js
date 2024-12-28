module.exports = {  
    projects: [  
        {  
            displayName: 'node',  
            testEnvironment: 'node',  
            // roots: ['src'],  
            transform: {  
                '^.+\\.ts$': 'ts-jest',  
            },  
            testMatch: [  
                '<rootDir>/src/__tests__/**/*.test.ts'  
            ],  
            transformIgnorePatterns: [  
                "node_modules/(?!(cheerio|parse5|entities|dom-serializer|domelementtype|domhandler|domutils|htmlparser2|nth-check|boolbase)/)"  
            ]  
        },  
        {  
            displayName: 'jsdom',  
            testEnvironment: 'jsdom',  
            // roots: ['src'],  
            transform: {  
                '^.+\\.tsx$': 'ts-jest',  
            },  
            testMatch: [  
                '<rootDir>/src/__tests__/**/*.test.tsx'  
            ],  
            moduleNameMapper: {  
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy'  
            },  
            // setupFilesAfterEnv: [  
            //     '@testing-library/jest-dom/extend-expect'  
            // ]  
        }  
    ],  
    // 全局共享配置  
    globals: {  
        'ts-jest': {  
            tsconfig: 'tsconfig.json'  
        }  
    },  
    verbose: true  
};
module.exports = {  
    projects: [  
        {  
            displayName: 'node',  
            testEnvironment: 'node',  
            transform: {  
                '^.+\\.ts$': 'ts-jest',  
            },  
            testMatch: [  
                '<rootDir>/src/__tests__/**/*.test.ts'  
            ],  
            moduleNameMapper: {  
                '^(\\.{1,2}/.*)\\.js$': '$1',  
            }  
        },  
        {  
            displayName: 'jsdom',  
            testEnvironment: 'jsdom',  
            transform: {  
                '^.+\\.(tsx|ts)$': 'ts-jest',  
            },  
            testMatch: [  
                '<rootDir>/src/__tests__/**/*.test.tsx'  
            ],  
            moduleNameMapper: {  
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  
                '^(\\.{1,2}/.*)\\.js$': '$1',  
            },
            transformIgnorePatterns: [  
                "<rootDir>/node_modules/(?!cheerio|static).+\\.js$"
            ], 
        }  
    ],  
    globals: {  
        'ts-jest': {  
            tsconfig: 'tsconfig.json'  
        }  
    },  
    verbose: true  
};
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration for Lucky Casino E2E Testing
 * Enterprise-grade configuration with comprehensive project setup
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Parallel execution settings
  fullyParallel: false, // Disable for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Sequential execution for stability
  
  // Global timeout settings
  timeout: 120000, // 2 minutes for all tests
  expect: {
    timeout: 30000 // 30 seconds for expect assertions
  },
  
  // Reporters configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results/results.json'
    }],
    ['junit', {
      outputFile: 'test-results/junit.xml'
    }],
    ['line']
  ],
  
  // Global test options
  use: {
    baseURL: process.env.BASE_URL || 'https://luckycoin777.live',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 120000,
    
    // Browser context options
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--enable-gpu',
        '--enable-gpu-rasterization',
        '--enable-accelerated-2d-canvas',
        '--enable-accelerated-mjpeg-decode',
        '--enable-accelerated-video-decode',
        '--enable-accelerated-video-encode',
        '--enable-zero-copy',
        '--ignore-gpu-blacklist',
        '--ignore-gpu-blocklist',
        '--use-gl=desktop',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    },
    
    // Geolocation settings for Ukraine
    geolocation: { 
      latitude: 50.4501, 
      longitude: 30.5234 
    },
    permissions: ['geolocation'],
    locale: 'uk-UA',
    timezoneId: 'Europe/Kiev'
  },

  // Test projects configuration
  projects: [
    // Tests WITHOUT global setup (for authentication process testing)
    {
      name: 'auth-without-setup',
      testMatch: 'tests/smoke/without-global-setup/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: undefined
      }
    },

    // Default project - all other tests WITH global setup
    {
      name: 'default',
      testMatch: 'tests/**/*.spec.ts',
      grep: /^(?!.*without-global-setup).*$/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: getStorageState()
      }
    },
    
    // Smoke tests - critical functionality
    {
      name: 'smoke',
      testMatch: 'tests/smoke/**/*.spec.ts',
      grep: /^(?!.*without-global-setup).*$/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: getStorageState()
      }
    },
    
    // Unit tests
    {
      name: 'unit',
      testMatch: 'tests/unit/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: getStorageState()
      }
    },
    
    // Geo tests
    {
      name: 'geo',
      testMatch: 'tests/geo/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: getStorageState()
      }
    },
    
    // Firefox testing
    {
      name: 'firefox',
      testMatch: 'tests/{smoke,unit,geo}/**/*.spec.ts',
      grep: /^(?!.*without-global-setup).*$/,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: getStorageState()
      }
    },
    
    // Ukraine geo testing
    {
      name: 'ukraine',
      testMatch: 'tests/**/*.spec.ts',
      grep: /^(?!.*without-global-setup).*$/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: getStorageState(),
        geolocation: { 
          latitude: 50.4501, 
          longitude: 30.5234 
        },
        permissions: ['geolocation'],
        locale: 'uk-UA',
        timezoneId: 'Europe/Kiev',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    },
    
    // Mobile testing
    {
      name: 'mobile',
      testMatch: 'tests/smoke/**/*.spec.ts',
      grep: /^(?!.*without-global-setup).*$/,
      use: { 
        ...devices['iPhone 12'],
        storageState: getStorageState()
      }
    }
  ],

  // Output directory
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: './src/setup/global-setup.ts',
  globalTeardown: undefined
});

/**
 * Helper function to get storage state path
 */
function getStorageState(): string | undefined {
  const fs = require('fs');
  const storagePath = process.env.AUTH_STORAGE_PATH || 'test-results/auth-storage.json';
  return fs.existsSync(storagePath) ? storagePath : undefined;
}
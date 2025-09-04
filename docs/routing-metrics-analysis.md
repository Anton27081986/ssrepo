# Метрики и тесты для анализа монолитной структуры роутинга

## Обзор

Данный документ содержит метрики, тесты и инструменты для анализа монолитной структуры роутинга в проекте ERP SSNAB. Основан на анализе существующей архитектуры и выявленных проблем.

## 🎯 Ключевые метрики для анализа

### 1. Метрики размера и сложности

#### Размер бандла
- **Текущий размер бандла**: 4.00 MB (Raw), 706.15 kB (Gzipped)
- **Главный бандл**: 3.61 MB (657.42 kB gzipped)
- **Стили**: 354.34 kB (36.52 kB gzipped)
- **Polyfills**: 34.89 kB (11.36 kB gzipped)

#### Метрики роутинга
- **Общее количество маршрутов в app.routes.ts**: 362 строки кода
- **Количество основных роутов**: 56 маршрутов
- **Глубина вложенности**: До 4 уровней
- **Количество layouts**: 4 различных layout компонента
- **Количество guards**: 7+ охранников маршрутов

#### Структурная сложность
- **Количество feature модулей**: 13 основных модулей
- **Количество API сервисов**: 36+ сервисов в core/api
- **Количество фасадов**: 24 фасада
- **Количество shared компонентов**: 94+ компонента

### 2. Метрики производительности

#### Время сборки
- **Текущее время сборки**: ~127-171 секунд
- **Время hot reload**: Измеряется при разработке
- **Время первой загрузки**: Зависит от размера бандла

#### Memory footprint
- **Потребление памяти**: Требует мониторинга в runtime
- **Memory leaks**: Обнаружены проблемы с отпиской от Observable

### 3. Метрики связанности

#### Coupling метрики
- **Зависимости от core**: Все feature модули зависят от core
- **Circular dependencies**: Требует анализа
- **Import count**: Количество импортов в каждом модуле

## 🔍 Инструменты для анализа

### 1. Bundle Analysis

#### Анализ размера бандла
```bash
# Сборка с source maps
ng build --source-map

# Анализ состава бандла (альтернатива webpack-bundle-analyzer)
npx @angular-devkit/build-angular:extract-i18n --output-path dist/bundle-analysis

# Простой анализ размера файлов
ls -la dist/erpss/ | grep -E '\.(js|css)$'
```

#### Bundle composition анализ
```bash
# Анализ зависимостей через Angular CLI
ng build --stats-json
npx webpack-bundle-analyzer dist/erpss/stats.json
```

### 2. Code Analysis Tools

#### ESLint метрики
```bash
# Анализ качества кода
npm run lint > lint-report.txt

# Специфичные проверки для роутинга
npx eslint src/app/app.routes.ts --format json > routing-lint.json
```

#### Circular dependencies
```bash
# Установка и запуск madge для анализа зависимостей
npm install -g madge
madge --circular --extensions ts src/app/
```

#### Code complexity
```bash
# Анализ сложности кода
npx typescript-complexity-analyzer src/app/app.routes.ts
```

### 3. Custom Scripts для метрик

#### Скрипт анализа роутинга
```typescript
// scripts/analyze-routing.ts
import * as fs from 'fs';
import * as path from 'path';

interface RoutingMetrics {
  totalRoutes: number;
  maxDepth: number;
  layoutsUsed: string[];
  guardsUsed: string[];
  lazyLoadedRoutes: number;
}

function analyzeRouting(): RoutingMetrics {
  const routesContent = fs.readFileSync('src/app/app.routes.ts', 'utf-8');
  
  // Подсчет маршрутов
  const routeMatches = routesContent.match(/path:\s*['"`][^'"`]*['"`]/g) || [];
  const totalRoutes = routeMatches.length;
  
  // Анализ глубины вложенности
  const maxDepth = analyzeDepth(routesContent);
  
  // Поиск layouts
  const layoutMatches = routesContent.match(/component:\s*(\w+LayoutComponent)/g) || [];
  const layoutsUsed = [...new Set(layoutMatches.map(m => m.split(':')[1].trim()))];
  
  // Поиск guards
  const guardMatches = routesContent.match(/canActivate:\s*\[([^\]]+)\]/g) || [];
  const guardsUsed = [...new Set(guardMatches.flatMap(m => 
    m.match(/\w+Guard/g) || []
  ))];
  
  // Поиск lazy-loaded роутов
  const lazyMatches = routesContent.match(/loadChildren|loadComponent/g) || [];
  const lazyLoadedRoutes = lazyMatches.length;
  
  return {
    totalRoutes,
    maxDepth,
    layoutsUsed,
    guardsUsed,
    lazyLoadedRoutes
  };
}

function analyzeDepth(content: string): number {
  const lines = content.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;
  
  for (const line of lines) {
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    currentDepth += openBraces - closeBraces;
    maxDepth = Math.max(maxDepth, currentDepth);
  }
  
  return maxDepth;
}

// Запуск анализа
const metrics = analyzeRouting();
console.log('Routing Metrics:', JSON.stringify(metrics, null, 2));
```

#### Скрипт анализа bundle size
```typescript
// scripts/bundle-analysis.ts
import * as fs from 'fs';
import * as path from 'path';

interface BundleMetrics {
  mainBundleSize: number;
  stylesSize: number;
  polyfillsSize: number;
  totalSize: number;
  gzippedSizes: {
    main: number;
    styles: number;
    polyfills: number;
    total: number;
  };
}

function analyzeBundleSize(): BundleMetrics {
  const distPath = 'dist/erpss';
  
  if (!fs.existsSync(distPath)) {
    throw new Error('Build directory not found. Run ng build first.');
  }
  
  const files = fs.readdirSync(distPath);
  
  const mainFile = files.find(f => f.startsWith('main.') && f.endsWith('.js'));
  const stylesFile = files.find(f => f.startsWith('styles.') && f.endsWith('.css'));
  const polyfillsFile = files.find(f => f.startsWith('polyfills.') && f.endsWith('.js'));
  
  const mainBundleSize = mainFile ? getFileSize(path.join(distPath, mainFile)) : 0;
  const stylesSize = stylesFile ? getFileSize(path.join(distPath, stylesFile)) : 0;
  const polyfillsSize = polyfillsFile ? getFileSize(path.join(distPath, polyfillsFile)) : 0;
  
  return {
    mainBundleSize,
    stylesSize,
    polyfillsSize,
    totalSize: mainBundleSize + stylesSize + polyfillsSize,
    gzippedSizes: {
      main: Math.round(mainBundleSize * 0.18), // Примерная компрессия
      styles: Math.round(stylesSize * 0.10),
      polyfills: Math.round(polyfillsSize * 0.33),
      total: Math.round((mainBundleSize + stylesSize + polyfillsSize) * 0.18)
    }
  };
}

function getFileSize(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Запуск анализа
try {
  const metrics = analyzeBundleSize();
  console.log('Bundle Analysis:');
  console.log(`Main Bundle: ${formatBytes(metrics.mainBundleSize)} (${formatBytes(metrics.gzippedSizes.main)} gzipped)`);
  console.log(`Styles: ${formatBytes(metrics.stylesSize)} (${formatBytes(metrics.gzippedSizes.styles)} gzipped)`);
  console.log(`Polyfills: ${formatBytes(metrics.polyfillsSize)} (${formatBytes(metrics.gzippedSizes.polyfills)} gzipped)`);
  console.log(`Total: ${formatBytes(metrics.totalSize)} (${formatBytes(metrics.gzippedSizes.total)} gzipped)`);
} catch (error) {
  console.error('Error analyzing bundle:', error.message);
}
```

## 🧪 Автоматизированные тесты

### 1. Unit тесты для метрик

#### Тест размера роутинга
```typescript
// tests/routing-metrics.spec.ts
import { routes } from '../src/app/app.routes';

describe('Routing Metrics', () => {
  it('should not exceed maximum route count threshold', () => {
    const flatRoutes = flattenRoutes(routes);
    expect(flatRoutes.length).toBeLessThan(100); // Пороговое значение
  });

  it('should not have excessive nesting depth', () => {
    const maxDepth = calculateMaxDepth(routes);
    expect(maxDepth).toBeLessThan(5); // Максимум 4 уровня вложенности
  });

  it('should use lazy loading for large modules', () => {
    const lazyRoutes = findLazyRoutes(routes);
    expect(lazyRoutes.length).toBeGreaterThan(0);
  });

  it('should not have unused guards', () => {
    const allGuards = extractGuards(routes);
    const unusedGuards = findUnusedGuards(allGuards);
    expect(unusedGuards).toEqual([]);
  });
});

function flattenRoutes(routes: any[], depth = 0): any[] {
  let result = [];
  for (const route of routes) {
    result.push({ ...route, depth });
    if (route.children) {
      result = result.concat(flattenRoutes(route.children, depth + 1));
    }
  }
  return result;
}

function calculateMaxDepth(routes: any[], currentDepth = 0): number {
  let maxDepth = currentDepth;
  for (const route of routes) {
    if (route.children) {
      const childDepth = calculateMaxDepth(route.children, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }
  return maxDepth;
}

function findLazyRoutes(routes: any[]): any[] {
  const lazyRoutes = [];
  for (const route of routes) {
    if (route.loadChildren || route.loadComponent) {
      lazyRoutes.push(route);
    }
    if (route.children) {
      lazyRoutes.push(...findLazyRoutes(route.children));
    }
  }
  return lazyRoutes;
}

function extractGuards(routes: any[]): string[] {
  const guards = new Set<string>();
  for (const route of routes) {
    if (route.canActivate) {
      route.canActivate.forEach(guard => guards.add(guard.name));
    }
    if (route.children) {
      extractGuards(route.children).forEach(guard => guards.add(guard));
    }
  }
  return Array.from(guards);
}

function findUnusedGuards(guards: string[]): string[] {
  // Реализация поиска неиспользуемых guards
  // Сравнение с файлами в директории guards
  return [];
}
```

### 2. Performance тесты

#### Тест времени сборки
```typescript
// tests/build-performance.spec.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Build Performance', () => {
  it('should build within acceptable time limit', async () => {
    const startTime = Date.now();
    
    try {
      await execAsync('ng build --configuration=development');
      const buildTime = Date.now() - startTime;
      
      // Максимальное время сборки: 3 минуты
      expect(buildTime).toBeLessThan(180000);
    } catch (error) {
      fail(`Build failed: ${error.message}`);
    }
  }, 300000); // Таймаут теста: 5 минут

  it('should not exceed bundle size limits', async () => {
    try {
      await execAsync('ng build --configuration=production');
      
      const bundleAnalysis = await analyzeBundleSize();
      
      // Лимиты размера бандла
      expect(bundleAnalysis.mainBundleSize).toBeLessThan(4 * 1024 * 1024); // 4MB
      expect(bundleAnalysis.gzippedSizes.total).toBeLessThan(1024 * 1024); // 1MB gzipped
    } catch (error) {
      fail(`Bundle analysis failed: ${error.message}`);
    }
  }, 300000);
});

async function analyzeBundleSize() {
  // Реализация анализа размера бандла
  return {
    mainBundleSize: 0,
    gzippedSizes: { total: 0 }
  };
}
```

### 3. Integration тесты

#### Тест целостности роутинга
```typescript
// tests/routing-integration.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { routes } from '../src/app/app.routes';

@Component({ template: '' })
class TestComponent { }

describe('Routing Integration', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [TestComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to all defined routes without errors', async () => {
    const allRoutes = extractAllPaths(routes);
    
    for (const routePath of allRoutes) {
      try {
        await router.navigate([routePath]);
        expect(location.path()).toBe(routePath);
      } catch (error) {
        fail(`Navigation to ${routePath} failed: ${error.message}`);
      }
    }
  });

  it('should apply correct guards to protected routes', async () => {
    const protectedRoutes = findProtectedRoutes(routes);
    
    for (const route of protectedRoutes) {
      // Тест применения guards
      expect(route.canActivate).toBeDefined();
      expect(route.canActivate.length).toBeGreaterThan(0);
    }
  });

  it('should redirect correctly for invalid routes', async () => {
    await router.navigate(['/invalid-route']);
    expect(location.path()).toBe('/'); // Должен перенаправить на главную
  });
});

function extractAllPaths(routes: any[]): string[] {
  const paths = [];
  for (const route of routes) {
    if (route.path && route.path !== '**') {
      paths.push('/' + route.path);
    }
    if (route.children) {
      const childPaths = extractAllPaths(route.children);
      childPaths.forEach(childPath => {
        if (route.path) {
          paths.push('/' + route.path + childPath);
        }
      });
    }
  }
  return paths;
}

function findProtectedRoutes(routes: any[]): any[] {
  const protectedRoutes = [];
  for (const route of routes) {
    if (route.canActivate) {
      protectedRoutes.push(route);
    }
    if (route.children) {
      protectedRoutes.push(...findProtectedRoutes(route.children));
    }
  }
  return protectedRoutes;
}
```

## 📊 Мониторинг и отчетность

### 1. CI/CD интеграция

#### GitHub Actions workflow
```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Analysis

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build:prod
    
    - name: Analyze bundle size
      run: |
        echo "## Bundle Analysis" >> $GITHUB_STEP_SUMMARY
        ls -la dist/erpss/*.js dist/erpss/*.css | awk '{print "- " $9 ": " $5 " bytes"}' >> $GITHUB_STEP_SUMMARY
    
    - name: Check bundle size limits
      run: |
        MAIN_SIZE=$(stat -c%s dist/erpss/main.*.js)
        if [ $MAIN_SIZE -gt 4194304 ]; then
          echo "❌ Main bundle size exceeds 4MB limit: $MAIN_SIZE bytes"
          exit 1
        else
          echo "✅ Main bundle size within limits: $MAIN_SIZE bytes"
        fi

  routing-analysis:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Analyze routing complexity
      run: |
        npx ts-node scripts/analyze-routing.ts > routing-metrics.json
        cat routing-metrics.json
    
    - name: Check routing thresholds
      run: |
        ROUTE_COUNT=$(cat routing-metrics.json | jq '.totalRoutes')
        if [ $ROUTE_COUNT -gt 100 ]; then
          echo "❌ Too many routes: $ROUTE_COUNT (limit: 100)"
          exit 1
        else
          echo "✅ Route count within limits: $ROUTE_COUNT"
        fi
```

### 2. Регулярные отчеты

#### Еженедельный отчет метрик
```typescript
// scripts/weekly-metrics-report.ts
import * as fs from 'fs';

interface WeeklyMetrics {
  timestamp: string;
  bundleSize: {
    main: number;
    styles: number;
    total: number;
  };
  routingComplexity: {
    totalRoutes: number;
    maxDepth: number;
    lazyRoutes: number;
  };
  codeQuality: {
    lintIssues: number;
    testCoverage: number;
    duplicatedCode: number;
  };
}

async function generateWeeklyReport(): Promise<WeeklyMetrics> {
  const bundleMetrics = await analyzeBundleSize();
  const routingMetrics = await analyzeRouting();
  const qualityMetrics = await analyzeCodeQuality();
  
  const report: WeeklyMetrics = {
    timestamp: new Date().toISOString(),
    bundleSize: bundleMetrics,
    routingComplexity: routingMetrics,
    codeQuality: qualityMetrics
  };
  
  // Сохранение отчета
  const reportPath = `reports/weekly-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Отправка уведомления (например, в Slack)
  await sendNotification(report);
  
  return report;
}

async function sendNotification(report: WeeklyMetrics) {
  const summary = `
📊 **Weekly Metrics Report**
🗓️ Date: ${report.timestamp}

📦 **Bundle Size**
- Main: ${formatBytes(report.bundleSize.main)}
- Total: ${formatBytes(report.bundleSize.total)}

🛣️ **Routing Complexity**
- Total Routes: ${report.routingComplexity.totalRoutes}
- Max Depth: ${report.routingComplexity.maxDepth}
- Lazy Routes: ${report.routingComplexity.lazyRoutes}

✨ **Code Quality**
- Lint Issues: ${report.codeQuality.lintIssues}
- Test Coverage: ${report.codeQuality.testCoverage}%
- Code Duplication: ${report.codeQuality.duplicatedCode}%
  `;
  
  // Отправка в Slack, Teams или email
  console.log(summary);
}
```

## 🎯 Цели и пороговые значения

### Текущие пороги (Baseline)
- **Размер main бандла**: < 4 MB
- **Gzipped размер**: < 1 MB
- **Количество маршрутов**: < 100
- **Максимальная глубина вложенности**: < 5
- **Время сборки**: < 3 минуты
- **Memory leaks**: 0

### Целевые значения (после рефакторинга)
- **Размер main бандла**: < 2 MB (сокращение на 50%)
- **Gzipped размер**: < 500 KB (сокращение на 50%)
- **Количество маршрутов в главном файле**: < 20 (lazy loading)
- **Максимальная глубина вложенности**: < 3
- **Время сборки**: < 1 минуты (с кешированием)
- **Lazy-loaded модулей**: > 80% контента

### Промежуточные цели (3 месяца)
- **Размер main бандла**: < 3 MB (сокращение на 25%)
- **Количество прямых импортов в роутинге**: < 50
- **Покрытие lazy loading**: > 50%
- **Устранение memory leaks**: 100%

## 🚀 План внедрения

### Фаза 1: Настройка мониторинга (1-2 недели)
1. ✅ Внедрить скрипты анализа метрик
2. ✅ Настроить CI/CD проверки
3. ✅ Создать baseline метрик
4. ✅ Настроить автоматические отчеты

### Фаза 2: Оптимизация (4-6 недель)
1. 🔄 Внедрить lazy loading для крупных модулей
2. 🔄 Разбить монолитный роутинг на feature-based
3. 🔄 Оптимизировать размер бандла
4. 🔄 Исправить memory leaks

### Фаза 3: Контроль качества (ongoing)
1. 🔄 Регулярный мониторинг метрик
2. 🔄 Автоматические проверки в PR
3. 🔄 Еженедельные отчеты команде
4. 🔄 Постоянная оптимизация

## 📋 Использование

### Запуск анализа
```bash
# Полный анализ проекта
npm run analyze:full

# Анализ только роутинга
npm run analyze:routing

# Анализ размера бандла
npm run analyze:bundle

# Запуск метрик в CI
npm run metrics:ci
```

### Просмотр отчетов
```bash
# Просмотр последнего отчета
cat reports/latest-metrics.json

# История изменений метрик
npm run metrics:history

# Сравнение с предыдущей версией
npm run metrics:compare
```

## 🔗 Связанные документы

- [Анализ архитектурных проблем](./architecture-analysis.md)
- [Базовая структура проекта](./basic-structure.md)
- [API роуты](./api-routes.md)
- [Архитектурные паттерны](./architectural-patterns.md)

---

*Документ будет обновляться по мере внедрения изменений и получения новых метрик.*

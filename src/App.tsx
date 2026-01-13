-import { Toaster } from "./components/ui/sonner";
+import { Toaster } from "./components/ui/sonner";
+import { ErrorBoundary } from "./components/ErrorBoundary";
...
-      <div className="pt-20">
-        {currentPage === 'landing' ? (
-          <LandingPage onNavigate={handleNavigate} />
-        ) : (
-          <Dashboard />
-        )}
-      </div>
+      <div className="pt-20">
+        <ErrorBoundary>
+          {currentPage === 'landing' ? (
+            <LandingPage onNavigate={handleNavigate} />
+          ) : (
+            <Dashboard />
+          )}
+        </ErrorBoundary>
+      </div>

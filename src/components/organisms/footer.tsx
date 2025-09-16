import { SiGithub } from "@icons-pack/react-simple-icons";
import { Heart, Globe, Star, GitFork, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          {/* Repository Call to Action */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Help Make Crysknife Better
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700"
                asChild
              >
                <a
                  href="https://github.com/brunos3d/crysknife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Star on GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700"
                asChild
              >
                <a
                  href="https://github.com/brunos3d/crysknife/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <GitFork className="h-4 w-4" />
                  Contribute
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700"
                asChild
              >
                <a
                  href="https://github.com/brunos3d/crysknife/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Report Issues
                </a>
              </Button>
            </div>
          </div>

          {/* Creator Attribution */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex items-center justify-center gap-1">
              Created with{" "}
              <Heart className="h-4 w-4 text-red-500 fill-current" /> by{" "}
              <a
                href="https://github.com/brunos3d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                <SiGithub className="h-4 w-4" />
                brunos3d
              </a>
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://brunosilva.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 text-sm"
              >
                <Globe className="h-4 w-4" />
                brunosilva.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

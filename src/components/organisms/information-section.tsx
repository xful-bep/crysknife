import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function InformationSection() {
  return (
    <div className="mt-16 space-y-8">
      {/* How it works */}
      <Card className="max-w-4xl mx-auto shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How Crysknife Works
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Detection Method</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• Searches for Shai-Hulud repository patterns</li>
                <li>
                  • Analyzes data.json files for base64-encoded stolen data
                </li>
                <li>• Decodes multi-encoded malware payloads</li>
                <li>• Identifies compromised authentication tokens</li>
                <li>• Runs directly in your browser for privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rate Limiting Info</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• Each user gets 60 GitHub API requests/hour</li>
                <li>• Analysis uses 2 API calls per GitHub account</li>
                <li>• NPM analysis has separate rate limits</li>
                <li>• Client-side execution for better performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="max-w-4xl mx-auto shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">About Shai-Hulud Malware</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Shai-Hulud is a sophisticated malware that targets development
            environments, stealing authentication tokens and sensitive
            information from GitHub and NPM accounts. It typically creates
            repositories named &ldquo;Shai-Hulud&rdquo; containing encoded
            stolen data.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            <strong>Learn more:</strong>{" "}
            <a
              href="https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Tinycolor Supply Chain Attack Analysis
            </a>{" "}
            - Detailed analysis of how this type of malware operates in the
            wild.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This tool analyzes potential infections by checking for malicious
            data patterns typically left behind by the Shai-Hulud malware in
            compromised systems. Named after the sandworms from Dune, Crysknife
            represents the weapon forged to fight this threat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

# 🔪 Crysknife - Shai-Hulud Malware Detection Tool

A sophisticated security analysis tool designed to detect and analyze Shai-Hulud malware infections across GitHub and NPM ecosystems. Named after the weapon forged from a sandworm's tooth in Dune, Crysknife is built to fight the Shai-Hulud malware threat.

<img width="867" height="577" alt="image" src="https://github.com/user-attachments/assets/e87215c2-71af-4bb6-9933-ec6face80443" />


## 🚨 What is Shai-Hulud Malware?

Shai-Hulud is a sophisticated malware that targets development environments, specifically:

- **Steals authentication tokens** from GitHub, NPM, AWS, and GCP
- **Creates malicious repositories** named "Shai-Hulud" containing encoded stolen data
- **Exfiltrates environment variables** and sensitive system information
- **Uses double base64 encoding** to obfuscate stolen credentials
- **Targets developers' workstations** and CI/CD environments

## 🛡️ Features

### Multi-Platform Detection

- **GitHub Account Analysis**: Scans for Shai-Hulud repositories and malicious data patterns
- **NPM Account Scanning**: Identifies compromised NPM accounts and malicious packages
- **Package Analysis**: Deep inspection of NPM packages for malware signatures
- **Token Detection**: Identifies and safely displays stolen authentication tokens

### Security Features

- **Safe Token Display**: Masked token viewing with copy functionality
- **Detailed Reports**: Comprehensive analysis reports with downloadable JSON
- **Real-time Analysis**: Live scanning using GitHub and NPM APIs
- **Threat Assessment**: Clear indicators of compromise levels

### User Experience

- **Modern UI**: Built with Next.js 15, Tailwind CSS, and shadcn/ui
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Full dark theme compatibility
- **Intuitive Interface**: Clean, security-focused design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Internet connection for API access

## 📖 How to Use

### 1. Select Analysis Type

Choose from the dropdown menu:

- **GitHub Account**: Analyze a specific GitHub username
- **NPM Account**: Check NPM user accounts for compromise
- **NPM Package**: Inspect individual packages for malware
- **NPM Repository**: Scan repository patterns

### 2. Enter Target

Type the username, package name, or repository to analyze.

### 3. Run Analysis

Click the search button to start the security scan.

### 4. Review Results

- **Green**: No threats detected
- **Red**: Compromise detected with detailed information

## 🔍 Detection Methods

### GitHub Analysis

- Searches for repositories named `Shai-Hulud`
- Analyzes `data.json` files for encoded payloads
- Decodes double base64-encoded stolen data
- Validates malware data structure patterns

### NPM Analysis

- Scans package metadata for malicious patterns
- Checks descriptions and keywords for threat indicators
- Analyzes package dependencies and scripts
- Identifies suspicious package names

### Token Detection

- Identifies GitHub Personal Access Tokens
- Detects NPM authentication tokens
- Finds AWS and GCP service credentials
- Safely displays found tokens with masking

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Type Safety**: TypeScript
- **API Integration**: GitHub REST API, NPM Registry API
- **State Management**: React Hooks

## 🔒 Security Considerations

### Safe Token Handling

- Tokens are masked by default
- No tokens are stored or transmitted to external services
- All analysis happens client-side when possible

### API Usage

- GitHub and NPM APIs are used read-only
- No authentication required for public data
- Rate limiting considerations for heavy usage
- Respectful API usage patterns

## 🤝 Contributing

We welcome contributions to improve Crysknife's detection capabilities:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-detection`
3. **Commit your changes**: `git commit -m 'Add new detection method'`
4. **Push to the branch**: `git push origin feature/new-detection`
5. **Submit a Pull Request**

### Areas for Contribution

- Additional malware signature detection
- Enhanced API integrations
- Improved user interface
- Performance optimizations
- Security enhancements

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

Crysknife is a security research and detection tool. It should be used responsibly and only on systems you own or have explicit permission to analyze. The authors are not responsible for any misuse of this tool.

## 🆘 Support

If you discover a security vulnerability or need assistance:

- **Security Issues**: Please report privately via email
- **Bug Reports**: Open an issue on GitHub
- **Feature Requests**: Submit an issue with the enhancement label
- **Questions**: Check existing issues or start a discussion

## 🏆 Acknowledgments

- Inspired by the Dune universe by Frank Herbert
- Built with the amazing Next.js and shadcn/ui ecosystems
- Security research community for malware analysis techniques
- Open source contributors making the web safer

---

**Stay vigilant, stay secure.** 🛡️

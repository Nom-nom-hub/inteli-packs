class InteliPacks < Formula
  desc "Smart developer assistant for Node.js project optimization using Gemini AI"
  homepage "https://github.com/yourusername/inteli-packs"
  url "https://github.com/yourusername/inteli-packs/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "YOUR_SHA256_HERE"  # Replace with actual SHA256 after first release
  license "MIT"
  head "https://github.com/yourusername/inteli-packs.git", branch: "main"

  depends_on "node@20"

  def install
    # Install dependencies
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    
    # Create the bin directory
    bin.mkpath
    
    # Create the executable script
    (bin/"inteli-packs").write <<~EOS
      #!/bin/bash
      exec "#{libexec}/bin/node" "#{libexec}/lib/node_modules/inteli-packs/index.js" "$@"
    EOS
    
    # Make it executable
    chmod 0755, bin/"inteli-packs"
  end

  test do
    # Test that the CLI works
    system "#{bin}/inteli-packs", "--version"
    
    # Test help command
    output = shell_output("#{bin}/inteli-packs --help")
    assert_match "Inteli-Packs", output
  end
end 
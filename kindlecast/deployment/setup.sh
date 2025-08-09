#!/bin/bash

# Setup script for deployment tools

echo "🛠️  Setting up deployment tools..."

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS"
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "📦 Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "✅ Homebrew already installed"
    fi
    
    # Install sshpass and rsync
    echo "📦 Installing required tools..."
    brew install sshpass rsync
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux"
    
    # Check if apt is available (Ubuntu/Debian)
    if command -v apt &> /dev/null; then
        echo "📦 Installing required tools with apt..."
        sudo apt update
        sudo apt install -y sshpass rsync
    # Check if yum is available (CentOS/RHEL)
    elif command -v yum &> /dev/null; then
        echo "📦 Installing required tools with yum..."
        sudo yum install -y sshpass rsync
    else
        echo "❌ Unsupported Linux distribution"
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "✅ Setup completed!"
echo ""
echo "🚀 You can now run:"
echo "   ./test-connection.sh  - Test VPS connection"
echo "   ./deploy.sh          - Deploy your application"

#!/usr/bin/env python3
"""
Quick setup script for Kaggle integration
Run this to set up Kaggle API and download traffic data
"""

import subprocess
import sys
import os
from pathlib import Path


def check_kaggle_installed():
    """Check if kagglehub is installed"""
    try:
        import kagglehub
        return True
    except ImportError:
        return False


def install_kagglehub():
    """Install kagglehub package"""
    print("📦 Installing kagglehub...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kagglehub"])
        print("✓ kagglehub installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install kagglehub")
        return False


def setup_kaggle_credentials():
    """Guide user through Kaggle API setup"""
    print("\n" + "=" * 60)
    print("🔑 Kaggle API Setup")
    print("=" * 60)
    
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_json = kaggle_dir / "kaggle.json"
    
    if kaggle_json.exists():
        print("✓ Kaggle credentials already configured")
        return True
    
    print("""
To use Kaggle datasets, you need to set up API credentials:

1. Go to: https://www.kaggle.com/settings/account
2. Scroll to "API" section
3. Click "Create New API Token"
4. This downloads kaggle.json
5. Move it to the correct location:
   
   Windows: %USERPROFILE%\\.kaggle\\kaggle.json
   macOS/Linux: ~/.kaggle/kaggle.json

After setting up credentials, run:
   python scripts/setup_kaggle.py

Or directly run:
   python scripts/seed_with_kaggle.py
    """)
    
    input("Press Enter after you've set up your Kaggle credentials...")
    
    if kaggle_json.exists():
        print("✓ Kaggle credentials found!")
        return True
    else:
        print("❌ Credentials not found. Please set up manually.")
        return False


def main():
    """Main setup"""
    print("=" * 60)
    print("🚀 Kaggle Integration Setup")
    print("=" * 60 + "\n")
    
    # Check and install kagglehub
    if not check_kaggle_installed():
        print("kagglehub not installed. Installing...")
        if not install_kagglehub():
            print("\n❌ Setup failed. Please install manually:")
            print("   pip install kagglehub")
            sys.exit(1)
    else:
        print("✓ kagglehub already installed")
    
    # Setup credentials
    if not setup_kaggle_credentials():
        sys.exit(1)
    
    # Download dataset
    print("\n" + "=" * 60)
    print("📥 Downloading Traffic Dataset")
    print("=" * 60)
    
    try:
        result = subprocess.run(
            [sys.executable, "scripts/seed_with_kaggle.py"],
            cwd=Path(__file__).parent.parent,
            check=True
        )
        print("\n✅ Setup complete!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

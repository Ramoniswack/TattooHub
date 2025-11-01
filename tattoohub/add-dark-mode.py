#!/usr/bin/env python3
"""
Script to add dark mode classes to all TSX/JSX files in the project
"""
import os
import re

# Dark mode class mappings - aesthetic dark colors (not pure black)
DARK_MODE_MAPPINGS = {
    # Backgrounds
    r'bg-white\b': 'bg-white dark:bg-gray-900',
    r'bg-gray-50\b': 'bg-gray-50 dark:bg-gray-800',
    r'bg-gray-100\b': 'bg-gray-100 dark:bg-gray-800',
    r'bg-slate-50\b': 'bg-slate-50 dark:bg-gray-800',
    r'bg-slate-100\b': 'bg-slate-100 dark:bg-gray-800',
    
    # Text colors
    r'text-slate-900\b': 'text-slate-900 dark:text-gray-100',
    r'text-slate-800\b': 'text-slate-800 dark:text-gray-200',
    r'text-slate-700\b': 'text-slate-700 dark:text-gray-300',
    r'text-slate-600\b': 'text-slate-600 dark:text-gray-400',
    r'text-slate-500\b': 'text-slate-500 dark:text-gray-500',
    r'text-gray-900\b': 'text-gray-900 dark:text-gray-100',
    r'text-gray-800\b': 'text-gray-800 dark:text-gray-200',
    r'text-gray-700\b': 'text-gray-700 dark:text-gray-300',
    r'text-gray-600\b': 'text-gray-600 dark:text-gray-400',
    
    # Borders
    r'border-gray-200\b': 'border-gray-200 dark:border-gray-700',
    r'border-gray-300\b': 'border-gray-300 dark:border-gray-600',
    r'border-slate-200\b': 'border-slate-200 dark:border-gray-700',
    r'border-slate-300\b': 'border-slate-300 dark:border-gray-600',
    
    # Hovers for buttons and links
    r'hover:bg-gray-50\b': 'hover:bg-gray-50 dark:hover:bg-gray-800',
    r'hover:bg-gray-100\b': 'hover:bg-gray-100 dark:hover:bg-gray-700',
    r'hover:bg-teal-50\b': 'hover:bg-teal-50 dark:hover:bg-gray-800',
}

def should_skip_file(filepath):
    """Check if file should be skipped"""
    skip_patterns = [
        '/node_modules/',
        '/.next/',
        '/dist/',
        '/build/',
        '.git/',
        'add-dark-mode.py'
    ]
    return any(pattern in filepath for pattern in skip_patterns)

def already_has_dark_class(line):
    """Check if line already has dark: classes"""
    return 'dark:' in line

def add_dark_mode_to_file(filepath):
    """Add dark mode classes to a file"""
    if should_skip_file(filepath):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Split into lines for processing
        lines = content.split('\n')
        updated_lines = []
        
        for line in lines:
            # Skip lines that already have dark mode classes
            if already_has_dark_class(line):
                updated_lines.append(line)
                continue
            
            # Skip className lines that don't have relevant classes
            if 'className=' not in line:
                updated_lines.append(line)
                continue
            
            updated_line = line
            for pattern, replacement in DARK_MODE_MAPPINGS.items():
                if re.search(pattern, updated_line):
                    updated_line = re.sub(pattern, replacement, updated_line)
                    changes_made += 1
            
            updated_lines.append(updated_line)
        
        if changes_made > 0:
            new_content = '\n'.join(updated_lines)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath} ({changes_made} changes)")
            return True
        
    except Exception as e:
        print(f" Error processing {filepath}: {e}")
    
    return False

def main():
    """Main function to process all files"""
    root_dir = '/home/ram0niswack/RootProjects/Bgtech/tabs-frontend-Ramoniswack/tattoohub/src'
    
    total_files = 0
    updated_files = 0
    
    print(" Adding dark mode classes to project...")
    print(f" Scanning directory: {root_dir}\n")
    
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and other build directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', 'dist', 'build']]
        
        for file in files:
            if file.endswith(('.tsx', '.jsx', '.ts', '.js')):
                filepath = os.path.join(root, file)
                total_files += 1
                
                if add_dark_mode_to_file(filepath):
                    updated_files += 1
    
    print(f"\n Dark mode addition complete!")
    print(f" Stats: {updated_files}/{total_files} files updated")

if __name__ == '__main__':
    main()

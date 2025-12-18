import os

def merge_web_files(source_dir, output_file, exclude_dirs, target_extensions):
    """
    Merges specific web files into one text file, optimized for Windows paths.
    """
    exclude_dirs = set(exclude_dirs)
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(source_dir):
            # Exclude folders efficiently
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for filename in files:
                # Check if the file matches our web extensions
                if not any(filename.lower().endswith(ext) for ext in target_extensions):
                    continue
                
                if filename == output_file:
                    continue
                
                # os.path.join handles Windows backslashes (\) automatically
                file_path = os.path.join(root, filename)
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        content = infile.read()
                        
                        # Formatting for the output file
                        relative_path = os.path.relpath(file_path, source_dir)
                        outfile.write(f"\n{'='*60}\n")
                        outfile.write(f"PATH: {relative_path}\n")
                        outfile.write(f"{'='*60}\n\n")
                        
                        outfile.write(content)
                        outfile.write("\n\n")
                        
                    print(f"Added: {relative_path}")
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

if __name__ == "__main__":
    # --- WINDOWS CONFIGURATION ---
    # Use '.' for the current folder or 'C:/Users/Name/Project' style paths
    TARGET_DIR = "./"  
    OUTPUT_NAME = "project_bundle.txt"
    
    # Common folders to skip in web development
    IGNORE = {
        ".git", "node_modules", ".vscode", "dist", 
        "build", "icons", "images", "assets", "fonts"
    }
    
    # Only pull content from these types of files
    EXTENSIONS = {".html", ".css", ".js", ".json", ".txt"}
    # -----------------------------

    merge_web_files(TARGET_DIR, OUTPUT_NAME, IGNORE, EXTENSIONS)
    print(f"\n--- SUCCESS ---")
    print(f"Created '{OUTPUT_NAME}' in: {os.path.abspath(TARGET_DIR)}")
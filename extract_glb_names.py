import struct
import json
import sys

def parse_glb(file_path):
    with open(file_path, 'rb') as f:
        # Read header
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a valid GLB file")
            return

        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]

        # Read chunks
        while f.tell() < length:
            chunk_length = struct.unpack('<I', f.read(4))[0]
            chunk_type = f.read(4)

            if chunk_type == b'JSON':
                json_data = f.read(chunk_length)
                data = json.loads(json_data)
                
                if 'nodes' in data:
                    print("Nodes found:")
                    for i, node in enumerate(data['nodes']):
                        name = node.get('name', f"Node_{i}")
                        print(f"- {name}")
                else:
                    print("No nodes found in JSON")
                return
            else:
                # Skip other chunks (BIN, etc.)
                f.seek(chunk_length, 1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_glb_names.py <file_path>")
    else:
        parse_glb(sys.argv[1])

#!/usr/bin/env python3
"""
Simple icon generator for cURL & WS Capture extension
Requires: pip install pillow
"""

try:
    from PIL import Image, ImageDraw
    import os
except ImportError:
    print("Please install Pillow: pip install pillow")
    exit(1)

def draw_icon(size):
    """Draw the extension icon at specified size"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    scale = size / 128.0
    
    # Background - blue rounded rectangle
    bg_color = (26, 115, 232, 255)  # #1a73e8
    draw.rounded_rectangle([(0, 0), (size-1, size-1)], 
                          radius=int(20*scale), 
                          fill=bg_color)
    
    # Scale coordinates
    def s(coord):
        """Scale a single coordinate"""
        return int(coord * scale)
    
    def sp(x, y):
        """Scale a point (x, y)"""
        return (s(x), s(y))
    
    white = (255, 255, 255, 255)
    green = (76, 175, 80, 255)
    
    # Center area offset
    offset_x = s(24)
    offset_y = s(24)
    
    # Draw signal waves (simplified as arcs)
    # Center dot
    center_x = offset_x + s(40)
    center_y = offset_y + s(20)
    dot_radius = s(4)
    draw.ellipse([center_x - dot_radius, center_y - dot_radius,
                  center_x + dot_radius, center_y + dot_radius],
                 fill=white)
    
    # Connector line
    line_start_y = center_y + dot_radius
    line_end_y = offset_y + s(45)
    line_width = max(1, s(3))
    draw.line([center_x, line_start_y, center_x, line_end_y],
              fill=white, width=line_width)
    
    # Network nodes
    nodes = [(20, 55), (40, 50), (60, 55)]
    node_radius = s(5)
    for nx, ny in nodes:
        node_x = offset_x + s(nx)
        node_y = offset_y + s(ny)
        draw.ellipse([node_x - node_radius, node_y - node_radius,
                      node_x + node_radius, node_y + node_radius],
                     fill=white)
    
    # Connection lines between nodes
    node1_x = offset_x + s(25)
    node1_y = offset_y + s(55)
    node2_x = offset_x + s(35)
    node2_y = offset_y + s(50)
    draw.line([node1_x, node1_y, node2_x, node2_y],
              fill=white, width=max(1, s(2)))
    
    node3_x = offset_x + s(45)
    node3_y = offset_y + s(50)
    node4_x = offset_x + s(55)
    node4_y = offset_y + s(55)
    draw.line([node3_x, node3_y, node4_x, node4_y],
              fill=white, width=max(1, s(2)))
    
    # Data packets (rectangles)
    packet_size = s(8)
    packet_x = offset_x + s(36)
    packet_y = offset_y + s(60)
    draw.rectangle([packet_x, packet_y, 
                   packet_x + packet_size, packet_y + packet_size],
                  fill=green)
    
    # Smaller packets
    small_packet = s(6)
    packet2_x = offset_x + s(16)
    packet2_y = offset_y + s(65)
    draw.rectangle([packet2_x, packet2_y,
                   packet2_x + small_packet, packet2_y + small_packet],
                  fill=green)
    
    packet3_x = offset_x + s(58)
    packet3_y = offset_y + s(65)
    draw.rectangle([packet3_x, packet3_y,
                   packet3_x + small_packet, packet3_y + small_packet],
                  fill=green)
    
    # Draw curved signal waves (simplified)
    wave_color = (255, 255, 255, 180)
    wave_width = max(1, s(3))
    
    # Inner waves
    draw.arc([center_x - s(15), center_y - s(15),
             center_x + s(15), center_y + s(15)],
            start=45, end=135, fill=white, width=s(4))
    draw.arc([center_x - s(15), center_y - s(15),
             center_x + s(15), center_y + s(15)],
            start=-45, end=45, fill=white, width=s(4))
    
    return img

def main():
    """Generate icons in different sizes"""
    sizes = [16, 48, 128]
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    for size in sizes:
        img = draw_icon(size)
        filename = os.path.join(script_dir, f'icon{size}.png')
        img.save(filename, 'PNG')
        print(f'✓ Generated {filename}')
    
    print('\n✓ All icons generated successfully!')
    print('\nThe icons are ready to use in your Chrome extension.')

if __name__ == '__main__':
    main()

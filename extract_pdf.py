import PyPDF2
import json

# Open and read the PDF
with open('Xplode_ Your Academy, Supercharged.pdf', 'rb') as pdf_file:
    reader = PyPDF2.PdfReader(pdf_file)
    
    content = {
        "total_pages": len(reader.pages),
        "pages": []
    }
    
    # Extract text from each page
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
            content["pages"].append({
                "page_number": i + 1,
                "text": text
            })
        except Exception as e:
            content["pages"].append({
                "page_number": i + 1,
                "text": f"ERROR: {str(e)}"
            })
    
    # Save as JSON
    with open('pdf_content.json', 'w', encoding='utf-8') as json_file:
        json.dump(content, json_file, indent=2, ensure_ascii=False)
    
    print(f"Extracted {content['total_pages']} pages successfully!")

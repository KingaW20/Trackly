export class MyImage {
    id: number = 0
    bytes: string = ""
    name: string = ""
    width: number = 0
    height: number = 0
    fileExtension: string = ""
    source: string = ""
    
    public uploadFile(event: Event) : Promise<string> {
        return new Promise((resolve, reject) => {
            const fileInput = event.target as HTMLInputElement;
            let imgURL = "";
        
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                    
                this.name = file.name;
                const extensionMatch = file.name.match(/\.([^.]+)$/);
                this.fileExtension = extensionMatch ? extensionMatch[1] : '';
            
                // Read file bytes
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as ArrayBuffer;
                    this.bytes = this.arrayBufferToBase64(result);
                
                    const blob = new Blob([result], { type: file.type });
                    imgURL = URL.createObjectURL(blob);
                    // resolve(imgURL);

                    const img = new Image();
                    img.onload = () => {
                        // Odczytaj szerokość i wysokość
                        this.width = img.naturalWidth;
                        this.height = img.naturalHeight;
                        resolve(imgURL);
                    };
                    img.onerror = (err) => {
                        reject("Error loading image dimensions: " + err);
                    };
                    img.src = imgURL;
                };

                reader.onerror = (error) => reject(error);            
                reader.readAsArrayBuffer(file);
            }
            else 
                reject("No file selected");
        })
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const binary = String.fromCharCode(...new Uint8Array(buffer));
        return window.btoa(binary);
    }
}

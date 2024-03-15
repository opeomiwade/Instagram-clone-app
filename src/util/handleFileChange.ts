
/**
 * Method called when trying to upload image file from computer.
 * Reads the file content and 
 * Converts image file url to a data url, so it can be displayed.
 * @param {React.ChangeEvent} event 
 * @param {React.Dispatch} setUrl 
 */
export default function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string | undefined>>) {
    const imageFile = event.target.files![0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setUrl(reader.result! as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }
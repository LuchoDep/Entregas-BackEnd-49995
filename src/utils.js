import { fileURLToPath } from "url";
import { dirname } from "path";


const __fileename = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileename);


export default __dirname;




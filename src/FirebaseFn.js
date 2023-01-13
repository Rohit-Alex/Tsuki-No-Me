import { db } from "./FirebaseConfig";
import { getDoc, doc, setDoc } from "@firebase/firestore";

const getterFn = async () => {
    try {
        const docSnap = await getDoc(doc(db, 'yin', 'pac1zajMuyJNsXKkIqqC'))
        if (docSnap.exists()) {
            
        } else {
            console.log("no data found")
        }
    }
    catch (e) {
        console.log("Error", e)
    }
}

const setterFn = async () => {
    try {
        await setDoc(doc(db, "yfcFootbalEvent", `${12324}`), { isPlayFootball: true });
    } catch (e) {
        console.log(e)
    }

}
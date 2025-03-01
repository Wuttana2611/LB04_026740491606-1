import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const loader = async () => {
  const querySnapshot = await getDocs(collection(db, "herbs"));
  const herbs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return herbs;
};

export default function MyHerbForm() {
  const herbs = useLoaderData();
  const [name, setName] = useState("");
  const [type, setType] = useState("leaf");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addDoc(collection(db, "herbs"), { name, type });
    alert("บันทึกข้อมูลสำเร็จ!");
    setName("");
    setType("leaf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">ฟอร์มบันทึกข้อมูลสมุนไพร</h2>
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>ชื่อสมุนไพร:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>ประเภท:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full">
            <option value="leaf">ใบ</option>
            <option value="root">ราก</option>
            <option value="flower">ดอก</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">บันทึก</button>
      </Form>

      <h3 className="text-lg font-bold mt-6">รายชื่อสมุนไพร</h3>
      <ul>
        {herbs.map((herb) => (
          <li key={herb.id} className="border p-2 my-2">{herb.name} - {herb.type}</li>
        ))}
      </ul>
    </div>
  );
}

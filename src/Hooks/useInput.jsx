import React from "react";
import { useState } from "react";

const useInput = (initialvalue = "") => {
    const [input, setInput] = useState(initialvalue);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const clearInput = () => {
        setInput("")
    }

    return [input, handleChange, clearInput]
}

export default useInput
/* Libraries */
import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt) => {
    window.onbeforeunload = (event) => {
        if (showExitPrompt) {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = '';
            }
            return '';
        }
    };
};

export default function useExitPrompt() {
    const [showExitPrompt, setShowExitPrompt] = useState(false);

    window.onload = function() {
        initBeforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt);
    }, [showExitPrompt]);

    return [showExitPrompt, setShowExitPrompt];
}

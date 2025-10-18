import React, { useState, useEffect } from 'react';

const Modal = (props) => {
    const [text, setText] = useState("");

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                cancel();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);
    
    const submit = (e) => {
        if (e) {
            e.preventDefault();
        }
        props.callBackFn(text);
    }

    const cancel = (e) => {
        setText("");
        props.callBackFn(false);
    }
    
    return (
        <div className="genericModal">
            <form onSubmit={submit}>
                <div className='modalForm'>
                    <input
                        autoFocus 
                        type="text"
                        name="query"
                        id="query"
                        placeholder={props.placeholder}
                        value={text}
                        onChange={e => {
                            setText(e.target.value)
                        }}
                    />
                    <input type="submit" value={props.btnValue} className="button primary small" />
                    <input type="reset" value="Cancel" className="button small" onClick={cancel} />
                </div> 
            </form>
        </div>
    );
};

export default Modal;
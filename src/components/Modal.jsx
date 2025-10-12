import React, { useState } from 'react';

const Modal = (props) => {
    const [text, setText] = useState("");

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
        <div className="genericModal" onClick={cancel}>
            <form onSubmit={submit}>
                <div className='modalForm'>
                    <input
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
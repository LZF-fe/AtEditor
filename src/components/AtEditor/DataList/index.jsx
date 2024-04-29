import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {debounce} from 'utils';

const DataList = ({
    refInstance,
    getEditorLeft,
    atList = [],
    addData = () => {},
}) => {
    useImperativeHandle(refInstance, () => {
        return {
            show,
            close,
        }
    }, []);
    const [isShow, setIsShow] = useState(false); // 是否显示下拉框
    const [highlightedIndex, setHighlightedIndex] = useState(0); // 下拉框选项高亮的下标
    const atListRef = useRef(null);

    useEffect(() => {
        const positionDropdown = () => {
            const range = getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const { left } = rect;
            atListRef.current.style.top = `${28}px`;
            atListRef.current.style.left = `${left - getEditorLeft()}px`;
            atListRef.current.style.display= 'block';
        };
        if (isShow && atListRef.current) {
            positionDropdown();
        } else {
            atListRef.current.style.display= 'none';
        }
    }, [isShow]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(pre => (pre - 1 >= 0 ? pre - 1 : atList.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(pre => (pre + 1 < atList.length ? pre + 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                selectData(atList[highlightedIndex]);
            }
        }

        if (isShow) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isShow, highlightedIndex]);

    const show = () => {
        setIsShow(true);
    }

    const close = () => {
        setIsShow(false);
        setHighlightedIndex(0);
    }

    const selectData = (row) => {
        close();
        addData(row);
    }

    const handleMouseMove = debounce((index) => {
        setHighlightedIndex(index);
    }, 50)

    return (
        <div className="at-list-content" ref={atListRef}>
            {
                atList.map((item, index) => (
                    <div
                        key={index}
                        className="at-item"
                        style={{
                        backgroundColor: highlightedIndex === index ? '#f5f5f5' : 'transparent',
                        }}
                        onClick={() => selectData(item)}
                        onMouseMove={() => handleMouseMove(index)}
                    >
                        {item.label}
                    </div>
                ))
            }
        </div>
    )
}

export default forwardRef(
    (props, ref) => <DataList {...props} refInstance={ref} />
)

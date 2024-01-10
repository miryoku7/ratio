"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { setLocalStorage, getLocalStorage } from "./api";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import BigNumber from "bignumber.js";

type DataItem = {
  name: string;
  value: number;
}

const Form = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const addNameRef = useRef<HTMLInputElement>(null);
  const [addName, setAddName] = useState<string>("");
  const [data, setData] = useState<DataItem[]>([]);
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const values = useMemo(() => {
    return data.map((d) => {
      return {
        ...d,
        ratio: new BigNumber(d.value).div(total).times(100).toNumber(),
      }
    });
  }, [data]);

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (data.length === 0) {
      return;
    }
    setLocalStorage("data", data);
  }, [data]);

  useEffect(() => { 
    const data = getLocalStorage<DataItem[]>("data");
    if (data) {
      setData(data);
    }
  },  []);


  const modalOpen = () => {
    modalRef?.current?.showModal();
  }
  const saveAddItem = () => {
    setData([...data, { name: addName, value: 0 }]);
    setAddName("");
    modalRef?.current?.close();
  }
  const changeAddName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddName(e.target.value);
  }
  const clearAddName = () => {
    setAddName("");
    addNameRef?.current?.focus();
  }
  const changeName = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[i].name = e.target.value;
    setData(newData);
  }

  const changeValue = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[i].value = Number(e.target.value);
    setData(newData);
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Ratio</h1>
      <div>
        {values.map((v, i) => {
          return (
            <div key={i} className="flex py-2">
              <div className=" mr-2">
                <input value={v.name} onChange={changeName(i)} type="text" className="w-full input input-bordered" />
              </div>
              <div className="mx-2 w-20">
                <input value={v.value} onChange={changeValue(i)} type="number" className="w-20 input input-bordered" />
              </div>
              <div className="py-2.5 w-24">
                {v.ratio.toFixed(2)}%
              </div>
            </div>
          )
        })}



        <div className="div">
          <button className="btn btn-square" onClick={modalOpen}> <AddIcon /></button>
          <dialog ref={modalRef} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">新しいアイテム</h3>
              <form className="flex py-2" onSubmit={(e) => {
                e.preventDefault();
                saveAddItem();
              }}>
                <input ref={addNameRef} value={addName} onChange={changeAddName} type="text" className="mx-2 w-full input input-bordered" />
                <button type="button" className="mx-2 btn btn-square" onClick={clearAddName}> <CloseIcon /></button>
              </form>
              <div className="flex pt-2">
                <div className="flex-grow"></div>
                <form method="dialog" className="block">
                  <button className="btn w-16 px-0 mx-1">閉じる</button>
                </form>
                <button onClick={saveAddItem} className="block btn w-16 px-0 mx-1 btn-primary">保存</button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>


      </div>
    </div>
  )
}

export default Form;
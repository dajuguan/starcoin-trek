import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import classnames from "classnames";
import { createRoot } from "react-dom/client";
import { useCallback } from "react";
import { arrayify, hexlify } from "@ethersproject/bytes";
import { utils, bcs } from "@starcoin/starcoin";
import { starcoinProvider } from "./app";
import { executeFunction } from "./txs/counter.tx";
import { COUNTER_ADDRESS, INCR_COUNTER_FUNC_NAMW, INCR_COUNTERBY_FUNC_NAME, INIT_COUNTER_FUNC_NAME } from "./txs/config";

export const makeModal = (props) => {
  const { children } = props;
  const escapeNode = document.createElement("div");
  const root = createRoot(escapeNode);
  document.body.appendChild(escapeNode);
  const onClose = () => {
    root.unmount();
    if (document.body.contains(escapeNode)) {
      document.body.removeChild(escapeNode);
    }
  };
  const Child = children({ onClose });
  root.render(<>{Child}</>);
};

const useFadeIn = () => {
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 10);
  }, []);

  return { isShow };
};

export const Mask = (props) => {
  const { onClose } = props;
  const { isShow } = useFadeIn();

  return (
    <div
      className={classnames(
        "fixed top-0 bottom-0 left-0 right-0 bg-black duration-300",
        isShow ? "opacity-80" : "opacity-0"
      )}
      onClick={() => {
        onClose();
      }}
    />
  );
};

export const Account = (props) => {
  const { isShow } = useFadeIn();
  const [hash, setHash] = useState("");
  const [txStatus, setTxStatus] = useState()

  useEffect(() => {
    setTxStatus("Pending...")
    const init_counter = async () => {
      let txHash = await executeFunction(COUNTER_ADDRESS, INIT_COUNTER_FUNC_NAME)
      setHash(txHash)
      let timer = setInterval(async () => {
        const txnInfo = await starcoinProvider.getTransactionInfo(txHash);
        setTxStatus(txnInfo.status)
        if (txnInfo.status === "Executed") {
          clearInterval(timer);
        }
      }, 500);
    }
    init_counter()

  }, [])


  return (
    <div
      className={classnames(
        "fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-2xl shadow-2xl w-3/4 p-6 bg-white duration-300",
        isShow ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}
    >
      {hash && (
        <div className="text-center mt-2 text-gray-500 break-all">
          Transaction: {hash}
        </div>
      )}
      {txStatus ? <div style={{ "textAlign": "Center" }}>{txStatus}</div> : null}
    </div>
  );
};

export const Counter = (props) => {
  const [hash, setHash] = useState('')
  const [txStatus, setTxStatus] = useState()
  useEffect(() => {
    setTxStatus("Pending...")
    const incr_counter = async () => {
      let txHash = await executeFunction(COUNTER_ADDRESS, INCR_COUNTER_FUNC_NAMW)
      setHash(txHash)
      let timer = setInterval(async () => {
        const txnInfo = await starcoinProvider.getTransactionInfo(txHash);
        setTxStatus(txnInfo.status)
        if (txnInfo.status === "Executed") {
          clearInterval(timer);
        }
      }, 500);
    }
    incr_counter()

  }, [])

  const { isShow } = useFadeIn();
  return <div className={classnames(
    "fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-2xl shadow-2xl w-3/4 p-6 bg-white duration-300",
    isShow ? "opacity-100 scale-100" : "opacity-0 scale-50"
  )}>
    {hash && (
      <div className="text-center mt-2 text-gray-500 break-all">
        Transaction Hash: {hash}
      </div>

    )}
    {txStatus ? <div style={{ "textAlign": "Center" }}>{txStatus}</div> : null}
  </div>
}


export const IncreaseCounterBy = (props) => {
  const [plus, setPlus] = useState(2)
  const [txHash, setTxHash] = useState()
  const [disabled, setDisabled] = useState(false)
  const [txStatus, setTxStatus] = useState()
  const handleCall = () => {
    setDisabled(true)
    setTxStatus("Pending...")
    const incr_counter_by = async () => {
      const tyArgs = []
      const args = [parseInt(plus)]
      let txHash = await executeFunction(COUNTER_ADDRESS, INCR_COUNTERBY_FUNC_NAME, tyArgs, args)
      setTxHash(txHash)
      let timer = setInterval(async () => {
        const txnInfo = await starcoinProvider.getTransactionInfo(txHash);
        setTxStatus(txnInfo.status)
        if (txnInfo.status === "Executed") {
          setDisabled(false)
          clearInterval(timer);
        }
      }, 500);
    }
    incr_counter_by()

  }
  const { isShow } = useFadeIn();

  return (
    <div
      className={classnames(
        "fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-2xl shadow-2xl w-3/4 p-6 bg-white duration-300",
        isShow ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}
    >
      <div className="font-bold">To</div>
      <div className="mt-2 mb-2">
        <input
          type="text"
          className="focus:outline-none rounded-xl border-2 border-slate-700 w-full p-4"
          value={plus}
          onChange={(e) => setPlus(e.target.value)}
        />
      </div>
      <div
        className="mt-6 p-4 flex justify-center font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        onClick={handleCall}
        disabled={disabled}
      >
        CALL
      </div>
      {txHash && (
        <div className="text-center mt-2 text-gray-500 break-all">
          Transaction: {txHash}
        </div>
      )}
      {txStatus ? <div style={{ "textAlign": "Center" }}>{txStatus}</div> : null}
    </div>
  );
};
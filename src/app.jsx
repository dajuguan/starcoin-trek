import React, { useState, useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import classnames from "classnames";
import { providers } from "@starcoin/starcoin";
import StarMaskOnboarding from "@starcoin/starmask-onboarding";
import { Account, Mask, makeModal, Counter, IncreaseCounterBy } from "./modal";
import "./style.css";
import { getResource } from "./txs/counter.tx";
import { COUNTER_ADDRESS, COUNTER_RESOURCE_ID } from "./txs/config";

export let starcoinProvider;

const currentUrl = new URL(window.location.href);

const forwarderOrigin = process.env.NETWORK === "dev" ? "http://localhost:3000" : "https://barnard-seed.starcoin.org"

console.log("forwarderOrigin", forwarderOrigin)

const { isStarMaskInstalled } = StarMaskOnboarding;

const onboarding = new StarMaskOnboarding({ forwarderOrigin });

console.log("forwarderOrigin", onboarding.forwarderOrigin)

export const App = () => {
  // 鼠标是否hover了connect按钮
  const [connectOver, setOver] = useState(false);
  // 是否已连接账户
  const [isStarMaskConnected, setConnected] = useState(false);
  // 已连接账户
  const [account, setAccount] = useState([]);

  const [isInstall, setInstall] = useState(true);

  const [counter, setCounter] = useState(0);

  const [initialized, setInitialized] = useState(true)

  const freshConnected = useCallback(async () => {
    const newAccounts = await window.starcoin.request({
      method: "stc_requestAccounts",
    });
    setAccount([...newAccounts]);
    setConnected(newAccounts && newAccounts.length > 0);
  }, []);

  const listenMessage = useCallback(() => {
    starcoin.on("accountsChanged", () => {
      console.log("account changed")
      freshConnected()
    })
  }, [])

  useEffect(() => {
    if (!isStarMaskInstalled()) {
      setInstall(false);
      alert("没有安装 starmask 插件！");
      onboarding.startOnboarding();
    } else {
      setInstall(true);
    }
  }, [freshConnected]);

  useEffect(async () => {
    try {
      starcoinProvider = new providers.Web3Provider(
        window.starcoin,
        "any"
      );
      getCounter()
    } catch {
      setInstall(false);
    }
  }, []);


  const handleClick = useCallback(() => {
    if (isStarMaskConnected) {
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      freshConnected();
    }
    listenMessage()
  }, [freshConnected, isStarMaskConnected]);

  const getCounter = async () => {
    try {
      let res = await getResource(COUNTER_ADDRESS, COUNTER_RESOURCE_ID)
      setCounter(res.value)
    } catch (err) {
      setInitialized(false)
      alert("please init counter first!")
    }

  }
  return (
    <div className="tracking-widest">
      {isInstall && (
        <>
          <div
            className={classnames(
              `flex text-gray-200 bg cursor-pointer bg-slate-800 p-6 justify-center duration-300 hover:bg-slate-900 hover:text-gray-50 text-3xl`,
              "bg-fixed bg-no-repeat bg-cover"
            )}
          >
            Starcoin
          </div>
          <div className=" flex justify-center mt-4">
            <div className="duration-300 sm:min-w-3/4 lg:min-w-1/2 border-2 border-slate-50 shadow-xl p-8 rounded-2xl mb-6 flex justify-center flex-col">
              <div
                className={classnames(
                  "rounded-2xl text-white font-extrabold p-8 duration-300 flex justify-center",
                  isStarMaskConnected
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-900 cursor-pointer"
                )}
                onClick={!isStarMaskConnected ? handleClick : null}
                onMouseOver={() => {
                  setOver(true);
                }}
                onMouseLeave={() => {
                  setOver(false);
                }}
              >
                <div
                  className={classnames(
                    "duration-500",
                    connectOver && !isStarMaskConnected && "scale-125"
                  )}
                >
                  {isStarMaskConnected ? "Connected" : "Connect"}
                </div>
              </div>

              <div
                className={classnames(
                  "duration-300 h-0 opacity-0",
                  isStarMaskConnected && "h-screen opacity-100"
                )}
              >
                {/* Address */}
                <div className="rounded-2xl bg-green-100 text-green-600 p-2 mt-4">
                  <div className="font-bold">Current address</div>
                  <div className="flex justify-center">
                    {account.map((t, index) => (
                      <div key={index} className="m-2">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contracts Function */}
                {/* Added parts Function */}

                <div className="font-bold">Contract Function</div>
                <div className="mt-4 shadow-2xl rounded-2xl border-2 border-slate-50 p-2">
                  <div
                    className="mt-4 rounded-2xl bg-blue-900 flex justify-center text-white p-4 font-bold cursor-pointer hover:bg-blue-700 duration-300"
                    onClick={() => {
                      if(initialized) {
                        return
                      }
                      makeModal({
                        children: ({ onClose }) => {
                          return (
                            <>
                              <Mask onClose={onClose} />
                              <Account />
                            </>
                          );
                        },
                      });
                    }}
                  >
                    {initialized ? "Counter has been initialized": "Init_counter"} 
                  </div>

                  <div
                    className="mt-4 rounded-2xl bg-blue-900 flex justify-center text-white p-4 font-bold cursor-pointer hover:bg-blue-700 duration-300"
                    onClick={() => getCounter()}
                  >
                    Get Counter:{counter}
                  </div>
                  <div
                    className="mt-4 rounded-2xl bg-blue-900 flex justify-center text-white p-4 font-bold cursor-pointer hover:bg-blue-700 duration-300"
                    onClick={() => {
                      makeModal({
                        children: ({ onClose }) => {
                          return (
                            <>
                              <Mask onClose={onClose} />
                              <Counter />
                            </>
                          );
                        },
                      });
                    }}
                  >
                    Incr_counter
                  </div>
                  <div
                    className="mt-4 rounded-2xl bg-blue-900 flex justify-center text-white p-4 font-bold cursor-pointer hover:bg-blue-700 duration-300"
                    onClick={() => {
                      makeModal({
                        children: ({ onClose }) => {
                          return (
                            <>
                              <Mask onClose={onClose} />
                              <IncreaseCounterBy />
                            </>
                          );
                        },
                      });
                    }}
                  >
                    Incr_counter_by
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

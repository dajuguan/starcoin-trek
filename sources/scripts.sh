# deploy
dev deploy [path to blob] -s [addr] -b
dev deploy /Users/cjf/Documents/bc/Web3-dApp-Camp/move-dapp/my-counter/release/my_counter.v0.0.1.blob -s 0x07Ffe973C72356C25e623E2470172A69 -b
# call init counter
account execute-function --function 0x07Ffe973C72356C25e623E2470172A69::MyCounter::init_counter -s 0x07Ffe973C72356C25e623E2470172A69 -b
# call function incr
account execute-function --function 0x07Ffe973C72356C25e623E2470172A69::MyCounter::incr_counter -s 0x07Ffe973C72356C25e623E2470172A69 -b
# call function incr by
account execute-function --function 0x07Ffe973C72356C25e623E2470172A69::MyCounter::incr_counter_by --arg 3 -s 0x07Ffe973C72356C25e623E2470172A69 -b
# get resource
state get resource 0x07Ffe973C72356C25e623E2470172A69 0x07Ffe973C72356C25e623E2470172A69::MyCounter::Counter

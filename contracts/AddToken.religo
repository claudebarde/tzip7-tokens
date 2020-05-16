type param = (string, string, address);
type token = { name: string, symbol: string, address: address, owner: address };

type storage = {
  tokensList: list (string),
  tokens: big_map (string, token),
};

let main = ((param,storage): (param, storage)) => {
  if(Tezos.amount > 0tez){
    failwith ("NoTokenAccepted"): (list(operation), storage);
  } else {
    // creates new token
    let newToken: token = 
      { name: param[0], symbol: param[1], address: param[2], owner: Tezos.source };
    // adds token to tokens big map
    let newTokensMap = switch(Big_map.find_opt(param[1], storage.tokens)) {
      | Some (n) => failwith ("TokenAlreadyExists"): big_map (string, token)
      | None => Big_map.update(param[1], Some (newToken), storage.tokens)
    };
    // adds token to list
    let newTokensList = [param[1], ...storage.tokensList];
    // returns new storage
    ([]: list(operation), { tokensList: newTokensList, tokens: newTokensMap});
  }
};
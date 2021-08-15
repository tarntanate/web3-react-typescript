import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";

export const fetcher_old =
  (library: any) =>
  (...args: any[]) => {
    const [method, ...params] = args;
    console.debug("fetcher method:", method);
    // console.debug(params);
    // console.debug("library[method]:", library[method]);
    return library[method](...params);
  };

export const fetcher =
  (library: any, abi: any) =>
  (...args: any[]) => {
    const [arg1, arg2, ...params] = args;
    console.debug("arg1", arg1);
    if (isAddress(arg1)) {
      // ถ้าส่ง arg1 มาเป็น address => it's a contract
      console.debug("Fetcher: It's a contract.", arg1, arg2);
      const address = arg1;
      const method = arg2;
      console.debug("..Address", address);
      console.debug("..Method", method);
      console.debug("..Params", params);
      const contract = new Contract(address, abi, library.getSigner());
      console.log(contract);
      // console.log(contract[method]);
      return contract[method](...params);
    } else {

      // ถ้าส่ง arg1 มาเป็นชื่อ method => it's a eth call
      console.debug("Fetcher: It's a eth call.");
      const method = arg1;
      return library[method](arg2, ...params);
    }
  };

import { useEnsName } from "wagmi";

export function useEnsNameFetch(address) {
  const { data: ensName } = useEnsName({ address });
  return ensName;
}
export default useEnsName;
const { AuthContext } = require("@/components/context/AuthProvider");
const { useContext } = require("react");

const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context
};

export default useAuth
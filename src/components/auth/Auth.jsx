import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Login from './Login'
import Signup from './Signup'


const Auth = () => {
    return <Tabs defaultValue='login' className='w-[30vw] m-auto mt-40  ' >
        
        <TabsContent value='login'>
            <Login />
        </TabsContent>
        <TabsContent value='Signup'>
            <Signup />
        </TabsContent>
        <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='login' >Login</TabsTrigger>
            <TabsTrigger value='Signup' >Sign Up</TabsTrigger>
        </TabsList>
    </Tabs>
}

export default Auth;
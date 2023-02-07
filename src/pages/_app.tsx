import "../styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "../store/store"
import { Layout } from "~/components"
import { ToastContainer } from "react-toastify"
import { CampaignProvider } from "~/hooks/useCampaign"

export default function App({ Component, pageProps }: AppProps) {
   return (
      <Provider store={store}>
         <Layout>
            <CampaignProvider>
               <Component {...pageProps} />
            </CampaignProvider>
         </Layout>
         <ToastContainer/>
      </Provider>
   )
}

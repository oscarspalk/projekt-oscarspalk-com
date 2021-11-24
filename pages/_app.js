import '../styles/globals.css'
import {GeistProvider, CssBaseline} from '@geist-ui/react'
function MyApp({ Component, pageProps }) {
  return(
    <GeistProvider>
      <CssBaseline>
      <Component {...pageProps} />
      </CssBaseline>
    </GeistProvider>
  )
}

export default MyApp

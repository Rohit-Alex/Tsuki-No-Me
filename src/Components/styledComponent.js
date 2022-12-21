import { ThemeProvider, createGlobalStyle } from 'styled-components'
import Button, { FancyButton, SubmitButton } from 'StyledComponent/Button'
import { AnimatedLogo, DarkButton } from 'StyledComponent/Button.style'

const theme = {
    dark: {
        primary: '#000',
        text: '#fff'
    },
    light: {
        primary: '#fff',
        text: '#000'
    },
    fontFamily: 'Segoe UI'
}

const GlobalStyle = createGlobalStyle`
  button {
    font-family: ${props => props.theme.fontFamily};
  }
`

function StyledComponent() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <div>
                <Button>Styled Button</Button>
                <div>
                    <br />
                </div>
                <Button variant='outline'>Styled Button</Button>
                <div>
                    <br />
                </div>
                <FancyButton>Fancy Button</FancyButton>
                <div>
                    <br />
                </div>
                <SubmitButton>Submit</SubmitButton>
                <div>
                    <br />
                </div>
                {/* <AnimatedLogo src={logo} /> */}
                <div>
                    <br />
                </div>
                <DarkButton>Dark Button</DarkButton>
            </div>
        </ThemeProvider>
    )
}

export default StyledComponent
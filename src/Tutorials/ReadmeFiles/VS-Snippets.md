// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and
// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope
// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is
// used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders.
// Placeholders with the same ids are connected.
{
  "console.log": {
    "scope": "javascript,typescript,typescriptreact",
    "prefix": "cli",
    "body": [
      "console.info('<<<== ${0: START} ==>>>', {output: ${1:variables}}, '<<<==||==>>>');"
    ],
    "description": "Log output to console with variable name"
  },
  "PrettyDOM": {
    "scope": "javascript,typescript,typescriptreact",
    "prefix": "pdom",
    "body": ["prettyDOM(${1:container}, 500000);", "$0"],
    "description": "prettyDOM"
  },
  "rtlDebug": {
    "scope": "javascript,typescript,typescriptreact",
    "prefix": "debug",
    "body": ["screen.debug(${1:undefined}, 500000);", "$0"],
    "description": "screen debug"
  },
  "useStateHook": {
    "scope": "javascript,typescript,typescriptreact",
    "prefix": "ust",
    "body": [
      "const [${1: first}, set${2:First}] = useState(${3: third});",
      "$0"
    ],
    "description": "screen debug"
  },
  "translate": {
    "scope": "javascript,typescript,typescriptreact",
    "prefix": "utl",
    "body": [
      "const { t: translate } = useTranslation();",
      "$0"
    ],
    "description": "use translate declaration"
  },
   "translateUse": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "tt",
    "body": [
      "translate('${1}') as string${0}"
    ],
    "description": "use translate declaration"
  },
  "exportDefault": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "expd",
    "body": [
      "export { default } from '.${0}'"
    ],
    "description": "export default a component"
  },
  "makeStyles": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "mks",
    "body": [
      "import { makeStyles } from '@bharatpe/bharat-ui/web/Styles';",
      "const useStyles = makeStyles({${0}})",
      "export default useStyles;"
    ],
    "description": "make a style hook"
  },
  "makeStylesClasses": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "usy",
    "body": [
      "const classes = useStyles()"
    ],
    "description": "get the class object from makeStyles"
  },
   "classNames": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "cxf",
    "body": [
      "import cx from 'classnames';",
      "$0"
    ],
    "description": "get the class object from makeStyles"
  },
  "history": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "his",
    "body": [
      "const history = useHistory();",
      "$0"
    ],
    "description": "invoke the useHistory hook"
  },
   "dispatcb": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "dis",
    "body": [
      "const dispatch = useDispatch();",
      "$0"
    ],
    "description": "invoke the useDispatch hook"
  },
  "funtionalComp": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "rfc",
    "body": [
      "React.FC $0",
    ],
    "description": "typescript for functional component"
  },
  "classNameWithCx": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "cxc",
    "body": [
      "className={cx('${1}')}$0",
    ],
    "description": "dynamic classname"
  },
  "tryCatchFinally": {
    "scope": "javascript, typescript, typescriptreact",
    "prefix": "tcf",
    "body": [
      "setLoading(true)",
      "try {",
      "\t$1",
      "} catch(err) {",
      "\tToasty.error((err as IError)?.message)",
      "} finally {",
      "\tsetLoading(false)",
      "}",
      "$0"
    ],
    "description": "dynamic classname"
  } 
}

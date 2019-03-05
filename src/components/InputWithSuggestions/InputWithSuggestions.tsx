import * as React from 'react'

import styles from './inputWithSuggestions.module.scss'

export interface IProps {
  readonly suggestions: string[]
  readonly className?: string
  readonly name?: string
  readonly value?: string
  readonly theme: 'default'
  readonly onChange?: (value: string, name?: string, onSelect?: boolean) => void
}

export interface IState {
  readonly suggestions: string[]
  readonly showSuggestions: boolean
  readonly suggestionIndex: number
}

class Suggestions extends React.Component<IProps, IState> {

  static defaultProps: { theme?: string } = {
    theme: 'default'
  }

  state = {
    suggestions: this.props.suggestions,
    showSuggestions: false,
    suggestionIndex: -1,
  }

  onInputFocus = () => {
    this.setState({ showSuggestions: true })
  }

  onInputBlur = () => {
    this.setState({ showSuggestions: false })
  }

  handleChange = ({ target: { value, name = '' } }: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const suggestions: string[] = this.props.suggestions.filter((suggestion: string) => suggestion.includes(value!))
    this.setState({ suggestions, showSuggestions: true })
    onChange && onChange(value, name)
  }

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestionIndex, suggestions } = this.state
    const { onChange, name } = this.props
    switch (event.which) {
      case 40: { // Arrow down
        event.preventDefault()
        if (suggestionIndex < suggestions.length - 1) {
          const newSuggestionIndex = suggestionIndex + 1
          this.setState({ suggestionIndex: newSuggestionIndex })
          onChange && onChange(suggestions[newSuggestionIndex], name)
        }
        break
      }
      case 38: { // Arrow up
        event.preventDefault()
        if (suggestionIndex > 0) {
          const newSuggestionIndex = suggestionIndex - 1
          this.setState({ suggestionIndex: newSuggestionIndex })
          onChange && onChange(suggestions[newSuggestionIndex], name)
        }
        break
      }
      case 13: { // Enter
        event.preventDefault()
        suggestionIndex >= 0 && this.selectSuggestion(suggestionIndex)
        break
      }
      default:
    }
  }

  onSuggestionClick = (event: React.MouseEvent<HTMLElement>) => {
    const index = event.currentTarget.getAttribute('data-index') || -1
    this.selectSuggestion(+index)
    event.stopPropagation()
  }

  selectSuggestion = (index: number) => {
    const { onChange, name = '' } = this.props
    const { suggestions } = this.state
    if (suggestions.length >= index - 1) {
      this.setState({
        suggestionIndex: index,
        showSuggestions: false
      })
      onChange && onChange(suggestions[index], name, true)
    }
  }

  suggestionsList = (): JSX.Element[] => this.state.suggestions.map((suggestion, index) => {
    let suggestionClass = styles.suggestion
    if (index === this.state.suggestionIndex) {
      suggestionClass += ' ' + styles.suggestionCurrent
    }
    return (
      <div className={suggestionClass} key={index} data-index={index} onMouseDown={this.onSuggestionClick}>
        {suggestion}
      </div>
    )
  })

  render = () => {
    const { showSuggestions, suggestions } = this.state
    const { className, name, theme, value } = this.props
    const _className = `${styles.container} ${className}`
    return (
      <div className={_className}>
        <input
          value={value}
          name={name}
          className={styles.input}
          data-theme={theme}
          onChange={this.handleChange}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyPress}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          autoComplete="off"
        />
        {
          showSuggestions && suggestions!.length > 0 ?
            <div className={styles.suggestions}>
              <div className={styles.suggestionNote}>
                Выберите вариант или продолжите ввод
              </div>
              {this.suggestionsList()}
            </div>
            : null
        }
      </div>
    )
  }
}

export default Suggestions
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { IIssues, IIssue, IIssuesRequest, createIssue } from '../../models'
import styles from './issueDetails.module.scss'
import { NotFound } from 'components'

export interface MatchParams {
  userName: string
  repoName: string
  id: string
}

export interface IProps extends RouteComponentProps<MatchParams> {
  readonly issues: IIssues
  readonly fetching: boolean
  readonly error: RequestError
  readonly fetchIssues: (request: IIssuesRequest) => void
}

export interface IState {
  readonly issue: IIssue
  readonly notFound: boolean
}

class IssueDetails extends React.Component<IProps, IState> {

  state = {
    issue: createIssue(),
    notFound: false
  }

  componentDidMount = () => {
    const { issues, fetchIssues, match: { params } } = this.props
    if (issues.userName === params.userName && issues.repoName == params.repoName) {
      const issue = issues.payload.find(issue => issue.id === +params.id)
      issue && this.setState({ issue })
    } else {
      fetchIssues({ userName: params.userName, repoName: params.repoName })
    }
  }

  componentWillReceiveProps = (nextProps: IProps) => {
    const { issues, error, match: { params } } = nextProps
    const issue = !error.message && issues.payload.find(issue => issue.id === +params.id)
    issue ? this.setState({ issue, notFound: false }) : this.setState({ notFound: true })
  }

  render = () => {
    const { issue, notFound } = this.state
    const { fetching } = this.props
    const date = new Date(issue.created_at)
    if (!fetching && notFound) return <NotFound />
    return (
      <div className={styles.item}>
        <a className={styles.avatar} href={issue.user.html_url}>
          <img src={issue.user.avatar_url} alt="" />
          <div className={styles.nick}>{issue.user.login}</div>
        </a>
        <div className={styles.itemBody}>
          <h4>{issue.title}</h4>
          <pre>{issue.body}</pre>
          <br />
          <span>#{issue.number} openned on {date.toDateString()}</span>
        </div>
      </div>
    )
  }
}

export default IssueDetails
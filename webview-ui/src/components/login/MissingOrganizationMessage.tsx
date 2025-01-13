import React from "react"
import styled from "styled-components"
import { UserNotPartOfAnyOrganizationError } from "../../../../src/shared/errors"

const ErrorMessage = styled.div`
	color: red;
	font-size: 16px;
	margin-top: 12px;
	margin-bottom: 12px;
`

const ContactInfo = styled.div`
	color: white;
	font-size: 14px;

	a {
		color: #4a90e2;
		text-decoration: none;
		font-weight: 500;

		&:hover {
			text-decoration: underline;
		}
	}
`

interface UserError {
	code: string
	message?: string
}

interface MissingOrganizationMessageProps {
	userErrors?: UserError[]
}

const MissingOrganizationMessage = ({ userErrors }: MissingOrganizationMessageProps) => {
	const hasOrgError = userErrors?.some((error) => error.code === UserNotPartOfAnyOrganizationError.code)

	if (!hasOrgError) return null

	return (
		<div>
			<ErrorMessage>Oops, looks like you are not a part of an organisation that supports this extension.</ErrorMessage>
			<ContactInfo>
				Reach out to <a href="mailto:jakob.cvetko@povio.com">jakob.cvetko@povio.com</a> to get access.
			</ContactInfo>
		</div>
	)
}

export default MissingOrganizationMessage

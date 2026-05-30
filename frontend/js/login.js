document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("login-form");
	const studentIdInput = document.getElementById("studentId");
	const passwordInput = document.getElementById("password");
	const rememberMeInput = document.getElementById("rememberMe");
	const messageBox = document.getElementById("formMessage");
	const togglePasswordButton = document.getElementById("togglePassword");

	const passwordRules = [
		{ regex: /[a-z]/, message: "incluir ao menos uma letra minuscula" },
		{ regex: /[A-Z]/, message: "incluir ao menos uma letra maiuscula" },
		{ regex: /\d/, message: "incluir ao menos um numero" },
		{ regex: /[^A-Za-z0-9]/, message: "incluir ao menos um caracter especial" },
	];

	const setMessage = (text, type) => {
		messageBox.textContent = text;
		messageBox.classList.remove("is-error", "is-success");

		if (type) {
			messageBox.classList.add(type);
		}
	};

	const validatePassword = (password) => {
		if (password.length < 8) {
			return "A senha precisa ter pelo menos 8 caracteres.";
		}

		const failedRule = passwordRules.find((rule) => !rule.regex.test(password));
		if (failedRule) {
			return `A senha precisa ${failedRule.message}.`;
		}

		return "";
	};

	const validateStudentId = (studentId) => {
		if (!studentId) {
			return "Informe seu numero de estudante.";
		}

		if (!/^\d+$/.test(studentId)) {
			return "O numero de estudante deve conter apenas numeros.";
		}

		if (studentId.length < 4) {
			return "O numero de estudante parece incompleto.";
		}

		return "";
	};

	togglePasswordButton.addEventListener("click", () => {
		const isHidden = passwordInput.type === "password";

		passwordInput.type = isHidden ? "text" : "password";
		togglePasswordButton.textContent = isHidden ? "Ocultar" : "Mostrar";
		togglePasswordButton.setAttribute("aria-pressed", String(isHidden));
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const studentId = studentIdInput.value.trim();
		const password = passwordInput.value;

		const studentIdError = validateStudentId(studentId);
		if (studentIdError) {
			setMessage(studentIdError, "is-error");
			studentIdInput.focus();
			return;
		}

		const passwordError = validatePassword(password);
		if (passwordError) {
			setMessage(passwordError, "is-error");
			passwordInput.focus();
			return;
		}

		const rememberedKey = "sistema-avaliacao:lastStudentId";

		if (rememberMeInput.checked) {
			window.localStorage.setItem(rememberedKey, studentId);
		} else {
			window.localStorage.removeItem(rememberedKey);
		}

		window.sessionStorage.setItem("sistema-avaliacao:authenticated", "true");
		window.sessionStorage.setItem("sistema-avaliacao:studentId", studentId);

		setMessage("Acesso validado. Redirecionando...", "is-success");

		window.setTimeout(() => {
			window.location.href = "./dashboard-aluno.html";
		}, 700);
	});

	const savedStudentId = window.localStorage.getItem("sistema-avaliacao:lastStudentId");
	if (savedStudentId) {
		studentIdInput.value = savedStudentId;
		rememberMeInput.checked = true;
	}
});

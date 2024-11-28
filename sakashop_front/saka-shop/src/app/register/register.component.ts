import { Component } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import Keyboard from "simple-keyboard";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupServiceService } from '../signup-service.service';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  signupForm: FormGroup | any ;
  userData:any;
  keyboard:Keyboard | undefined = undefined; ;
  value = "";
  errorMessage: string | null = null;
  constructor(private user: UserServiceService , private fb: FormBuilder, private signupService: SignupServiceService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      c_password: ['', [Validators.required]]
    },
    { validators: this.passwordsMatchValidator } );
  }
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const c_password = control.get('c_password');
    if (password && c_password && password.value !== c_password.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }
  signUp(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const formData = this.signupForm.value;
    this.errorMessage = null; // Réinitialise le message d'erreur

    this.signupService.registerUser(formData).subscribe(
      (response) => {
        alert('User registered successfully!');
      },
      (error) => {
        this.errorMessage = error.message; // Récupère le message d'erreur
      }
    );
  }
  get passwordMismatch(): boolean {
    return (
      this.signupForm.hasError('passwordsMismatch') &&
      this.signupForm.get('password')?.touched &&
      this.signupForm.get('c_password')?.touched
    );
  }
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      mergeDisplay: true,
      layoutName: "default",
      layout: {
        default: [
          "q w e r t y u i o p",
          "a s d f g h j k l",
          "{shift} z x c v b n m {backspace}",
          "{numbers} {space} {ent}"
        ],
        shift: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{shift} Z X C V B N M {backspace}",
          "{numbers} {space} {ent}"
        ],
        numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
      },
      display: {
        "{numbers}": "123",
        "{ent}": "return",
        "{escape}": "esc ⎋",
        "{tab}": "tab ⇥",
        "{backspace}": "⌫",
        "{capslock}": "caps lock ⇪",
        "{shift}": "⇧",
        "{controlleft}": "ctrl ⌃",
        "{controlright}": "ctrl ⌃",
        "{altleft}": "alt ⌥",
        "{altright}": "alt ⌥",
        "{metaleft}": "cmd ⌘",
        "{metaright}": "cmd ⌘",
        "{abc}": "ABC"
      }
      
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard?.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard?.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard?.setOptions({
      layoutName: shiftToggle
    });
  };

  handleNumbers() {
    let currentLayout = this.keyboard?.options.layoutName;
    let numbersToggle = currentLayout !== "numbers" ? "numbers" : "default";

    this.keyboard?.setOptions({
      layoutName: numbersToggle
    });
  }


}

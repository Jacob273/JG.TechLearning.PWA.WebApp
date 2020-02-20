using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Threading;

namespace JG.TechLearning.ConsoleApp.SeleniumTests
{
    class Program
    {
        static void Main(string[] args)
        {
            IWebDriver _driver = null;
            try
            {
                //preparation
                const string serviceToTestAddress = "https://localhost:1337";
                _driver = new ChromeDriver();
                _driver.Navigate().GoToUrl(serviceToTestAddress);
                
                //accessing UI elements by ids
                IWebElement geProjectId_Input = _driver.FindElement(By.Id("parentNumberInput"));
                IWebElement getprojectData_Button = _driver.FindElement(By.Id("getProjectDataButton"));
                IWebElement parentProjectNumber_Label = _driver.FindElement(By.Id("parentNumberLabel"));

                //Test 1 - Checking if label will contain correct data after pushing the button which cause database query
                //interaction
                const string parentNumberToSearch = "999-44-4444";
                geProjectId_Input.Clear();
                geProjectId_Input.SendKeys(parentNumberToSearch);
                getprojectData_Button.Click();

                //verification
                const string expectedTextInParentNumberInLabel = "Numer polskiego projektu: 999-44-4444";
                Assert.AreEqual(expectedTextInParentNumberInLabel, parentProjectNumber_Label.Text);
                Console.WriteLine($"Test 1# completed with a success. expected<{expectedTextInParentNumberInLabel}> actual<{parentProjectNumber_Label.Text}>");

                //Test 2 - Checking if label is empty after invalid data were entered
                const string invalidParentNumberWhichDoesnNotExist = "AAAAXXxxxx";
                geProjectId_Input.Clear();
                geProjectId_Input.SendKeys(invalidParentNumberWhichDoesnNotExist);
                getprojectData_Button.Click();
                Assert.AreEqual(string.Empty, parentProjectNumber_Label.Text);
                Console.WriteLine($"Test 2# completed with a success. expected<{string.Empty}> actual<{parentProjectNumber_Label.Text}>");


            }
            catch (AssertionException ex)
            {
                Console.WriteLine($"Test have failed, reason: <{ex.Message}>");
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error occured during test, error message: <{ex.Message}>");
            }
            finally
            {
                Console.ReadKey();
                _driver?.Close();
            }
        }
    }
}
